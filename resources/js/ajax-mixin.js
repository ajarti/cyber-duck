module.exports = {
    computed : {},
    data()
    {
        return {
            noRecords      : false,
            paginator      : {
                descending  : true,
                page        : 1,
                rowsPerPage : 10,
                sortBy      : '',
                totalItems  : 0
            },
            selected       : [],
            serverReturned : false
        }
    },
    methods  : {
        debouncedLoader : _.debounce(function(loader){
            var self = this;
            self.setValue(self.paginator,'page',1);
            self[loader]();
        }, 500),
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
        }
    }
}