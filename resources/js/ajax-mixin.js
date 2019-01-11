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
                    if ( _.has(success, 'data') ) {
                        //self.processMessages(success.data, success.status);
                    }
                    onSuccess(success);
                })
                .catch(function(error){
                    window.log('ajax-mixins.fetch: Error Response:', error);

                    // Check for bad auth.
                    if ( _.has(error, 'response.status') && _.isEqual(error.response.status, 403) ) {
                        window.log('ERROR DETECTED!!');
                        self.alert('Either you are not authorised to access to this resource or you may have been logged out due to inactivity. Try reloading the page, if the problem persist please contact your admin to assist.', 'warning', 6000)
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