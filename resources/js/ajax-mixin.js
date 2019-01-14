module.exports = {
    computed : {
        isLoading()
        {
            var self = this;
            return (self.loading || self.saving || self.deleting || self.restoring);
        },
        reloadTrigger()
        {
            var self = this;
            return [
                self.query,
                self.deleted
            ].join('');
        }
    },
    data()
    {
        return {
            collectionLoader : '',
            companies        : [],
            currentObj       : {},
            deleting         : false,
            employees        : [],
            noRecords        : false,
            loading          : false,
            originalObj      : {},
            paginator        : {
                descending  : true,
                page        : 1,
                rowsPerPage : 10,
                sortBy      : '',
                totalItems  : 0
            },
            query            : '',
            restoring        : false,
            saving           : false,
            selected         : [],
            serverReturned   : false
        }
    },
    methods  : {
        debouncedLoader : _.debounce(function(loader){
            var self = this;
            self.setValue(self.paginator, 'page', 1);
            self[loader]();
        }, 500),
        edit(obj)
        {
            var self = this;
            var obj  = obj || null;

            // Reset.
            self.resetForm();
            self.resetValidation();
            self.setValue(self, 'currentObj', _.clone(self.blankObj));
            self.setValue(self, 'originalObj', _.clone(self.blankObj));

            // Create/Update?
            if ( _.isNull(obj) ) {
                self.setValue(self, 'action', 'create');
            } else {
                self.setValue(self, 'action', 'update');
                self.setValue(self, 'currentObj', _.clone(obj));
                self.setValue(self, 'originalObj', _.clone(obj));
            }

            // Edit.
            self.setValue(self, 'showEditor', true);
        },
        fetch(configIn)
        {
            var self   = this;
            var config = configIn || null;
            if ( _.isNull(config) ) {
                window.log('ajax-mixins.fetch: No config?!', config);
                return;
            }

            window.log('ajax-mixins.fetch: Calling server with data:', config);

            // Setup method
            let method = (_.has(config, 'method') && !_.isEmpty(config.method)) ? config.method : 'post';

            // Stop multi submissions.
            if ( _.has(config, 'flag') && self[config.flag] ) {
                return; // in-progress
            } else {
                self.setValue(self, config.flag, true);
            }

            // Default success callback.
            let onSuccess = config.success || function(response){
            };

            // Default error callback.
            let onError = config.error || function(response){
            };

            // Call Server ...
            self.serverReturned = false;
            window.axios[method](config.url, config.data)
                .then(function(success){
                    window.log('ajax-mixins.fetch: Success Response:', success);
                    if ( _.has(success, 'data.status') && _.isEqual(success.data.status, 'success') ) {
                        var successMessages = []
                        // General server error responses.
                        if ( _.has(success.data, 'messages') ) {
                            _.each(success.data.messages, function(value, key){
                                successMessages.push(_.isArray(value) ? value.join(', ') : value);
                            });
                            self.alert(successMessages.join(', ') + '.', 'success', 3000);
                        }
                    }
                    onSuccess(success);
                })
                .catch(function(error){
                    window.log('ajax-mixins.fetch: Error Response:', error);

                    // Check for bad auth.
                    if ( _.has(error, 'response.status') && _.isEqual(error.response.status, 403) ) {
                        self.alert('Either you are not authorised to access to this resource or you may have been logged out due to inactivity. Try reloading the page, if the problem persist please contact your admin to assist.', 'warning', 6000)
                    }

                    // Check for server-sent issue.
                    if ( _.has(error, 'response.status') && _.isEqual(error.response.status, 422) ) {
                        var validationErrors = [];

                        // Request Validation issues.
                        if ( _.has(error, 'response.data.errors') ) {
                            _.each(error.response.data.errors, function(value, key){
                                validationErrors.push(_.isArray(value) ? value.join(', ') : value);
                            });
                        }

                        // General server error responses.
                        if ( _.has(error, 'response.data.messages') ) {
                            _.each(error.response.data.messages, function(value, key){
                                validationErrors.push(_.isArray(value) ? value.join(', ') : value);
                            });
                        }

                        self.alert('There was a problem with your request: ' + validationErrors.join(', ') + '. Please try again or contact your admin to assist.', 'error', 6000)
                    }


                    if ( _.has(error, 'response.data') ) {
                        //self.processMessages(error.response.data, error.response.status);
                    }
                    onError(error);
                })
                .then(function(){
                    window.log('ajax-mixins.fetch: Always called:');
                    self.setValue(self, config.flag, false); // All done ..
                    self.setValue(self, 'serverReturned', true);
                });
        },
        loadCompanies()
        {
            var self = this;
            self.fetch({
                url     : '/companies/search',
                data    : {
                    deleted  : self.deleted ? 1 : 0,
                    q        : self.query,
                    page     : self.paginator.page,
                    per_page : self.paginator.rowsPerPage
                },
                success : function({ data }){
                    if ( _.has(data, 'status') && data.status == 'success' ) {
                        self.setValue(self, 'companies', []);
                        if ( _.has(data, 'companies') && !_.isEmpty(data.companies) ) {
                            _.each(data.companies, function(company){
                                self.companies.push(company);
                            });
                            if ( _.has(data, 'pagination') && !_.isEmpty(data.pagination) ) {
                                self.setValue(self, 'paginator', data.pagination);
                            }

                        }
                    }
                },
                flag    : 'loading'
            });
        },
        loadEmployees()
        {
            var self = this;
            self.fetch({
                url     : '/employees/search',
                data    : {
                    deleted  : self.deleted ? 1 : 0,
                    q        : self.query,
                    page     : self.paginator.page,
                    per_page : self.paginator.rowsPerPage
                },
                success : function({ data }){
                    if ( _.has(data, 'status') && data.status == 'success' ) {
                        self.setValue(self, 'employees', []);
                        if ( _.has(data, 'employees') && !_.isEmpty(data.employees) ) {
                            _.each(data.employees, function(employee){
                                self.employees.push(employee);
                            });
                            if ( _.has(data, 'pagination') && !_.isEmpty(data.pagination) ) {
                                self.setValue(self, 'paginator', data.pagination);
                            }

                        }
                    }
                },
                flag    : 'loading'
            });
        },
        restore(obj)
        {
            var self = this;
            var obj  = obj || null;
            if ( self.restoring || (_.isNull(obj) && _.has(obj, 'id')) ) return;

            self.fetch({
                url     : '/' + self.currentObjType + '/restore',
                data    : { id : obj.id },
                success : function({ data }){
                    if ( _.has(data, 'status') && data.status == 'success' ) {
                        self.debouncedLoader(self.collectionLoader);
                        self.setValue(self, 'showEditor', false);
                    }
                },
                flag    : 'restoring'
            });

        },
        softDelete(obj)
        {
            var self = this;
            var obj  = obj || null;
            if ( self.deleting || (_.isNull(obj) && _.has(obj, 'id')) ) return;

            self.fetch({
                url     : '/' + self.currentObjType + '/delete',
                data    : { id : obj.id },
                success : function({ data }){
                    if ( _.has(data, 'status') && data.status == 'success' ) {
                        self.debouncedLoader(self.collectionLoader);
                        self.setValue(self, 'showEditor', false);
                    }
                },
                flag    : 'deleting'
            });
        }
    },
    watch    : {
        reloadTrigger()
        {
            var self = this;
            self.debouncedLoader(self.collectionLoader);
        }
    }
}