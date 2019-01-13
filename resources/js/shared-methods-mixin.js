module.exports = {
    computed : {
        creating()
        {
            var self = this;
            return (_.has(self, 'action') && _.isEqual(self.action, 'create'));
        },
        updating()
        {
            var self = this;
            return (_.has(self, 'action') && _.isEqual(self.action, 'update'));
        }
    },
    data()
    {
        return {
            action : '',
        }
    },
    methods  : {
        alert(message, status, timeout)
        {
            var self    = this;
            var status  = status || 'success'
            var message = message || null;
            var timeout = timeout || 3000;
            if ( _.isNull(message) ) return;
            var messagePacket = {
                message : message,
                status  : status,
                timeout : timeout
            }
            EventBus.$emit('snackmessage', messagePacket);
        },
        clear(field, value)
        {
            var self  = this;
            var field = field || null;
            var value = value || '';
            if ( _.isNull(field) ) return;
            if ( _.has(self, field) ) {
                self.setValue(self, field, value);
            }
        },
        exists(obj, root)
        {
            var self = this;
            var root = root || self;
            return _.has(root, obj);
        },
        getBooleanValue(ref)
        {
            var self = this;
            var ref  = ref || null;
            if ( _.isNull(ref) || !_.isString(ref) ) {
                window.log('shared-mixins.getBooleanValue: bad string reference.');
                return '';
            }
            if ( !_.has(self, ref) ) {
                window.log('shared-mixins.getBooleanValue: self.' + ref + ' does not exist.');
                return '';
            }
            return _.get(self, ref) ? 1 : 0;
        },
        getNumericValue(ref)
        {
            var self = this;
            var ref  = ref || null;
            if ( _.isNull(ref) || !_.isString(ref) ) {
                window.log('shared-mixins.getNumericValue: bad string reference.');
                return '';
            }
            if ( !_.has(self, ref) ) {
                window.log('shared-mixins.getNumericValue: self.' + ref + ' does not exist.');
                return '';
            }
            return _.toNumber(_.get(self, ref));
        },
        getStringValue(ref)
        {
            var self = this;
            var ref  = ref || null;
            if ( _.isNull(ref) || !_.isString(ref) ) {
                window.log('shared-mixins.getStringValue: bad string reference.');
                return '';
            }
            if ( !_.has(self, ref) ) {
                window.log('shared-mixins.getStringValue: self.' + ref + ' does not exist.');
                return '';
            }
            return _.get(self, ref);
        },
        hasLength(value)
        {
            var self  = this;
            var value = value || null;
            if ( _.isNull(value) ) return false;
            if ( _.isArray(value) ) {
                return !_.isEmpty(value);
            } else {
                return !!(_.toString(value).length);
            }
        },
        highlight(value, field)
        {
            var self  = this;
            var field = field || 'query';
            var value = value || '';

            // Only if needed.
            if ( _.has(self, field) && _.isEmpty(self[field]) ) {
                return value;
            }

            // Highlight
            if ( _.has(self, field) && _.isString(self[field]) && !_.isEmpty(self[field]) ) {
                var keywords = self[field].replace(/\s\s+/g, ' ').split(' ');

                // Make sure we have search data or return original.
                if ( !_.isArray(keywords) || _.isEmpty(keywords) || _.isEmpty(keywords[0]) ) return value;

                keywords = keywords.filter(function(n){
                    return ((n != undefined) && n != '' && n != null)
                });

                var keywords = keywords.join('|').replace('(', '\\(').replace(')', '\\)');
                var search   = new RegExp('(' + keywords + ')', 'gi');

                if ( _.isString(value) && !_.isEmpty(value) ) {
                    var value = value.replace(search, function(match){
                        return '<span class="lime lighten-3">' + match + '</span>';
                    });
                }
                return value;

            }

            return value;
        },
        isDeleted(obj)
        {
            var self = this;
            var obj  = obj || null;
            if ( _.isNull(obj) || !_.has(obj, 'deleted') ) return false;
            return (obj.deleted);
        },
        isSelected(item, collectionPath, id)
        {
            var self           = this;
            var item           = item || null;
            var collectionPath = collectionPath || null;
            var id             = id || 'id'; // e.g. countries uses cca2.

            if ( _.isNull(item) || _.isNull(collectionPath) || !_.isString(collectionPath) || !_.has(self, collectionPath) || !_.has(item, id) ) {
                window.log('shared-mixins.isSelected: Bad item, id key or collection path.');
                return false;
            }

            return !!_.find(_.get(self, collectionPath) || [], { 'id' : item[id] });
        },
        selectItem(item, collection, key)
        {
            var self       = this;
            var item       = item || null;
            var collection = collection || null;
            var key        = key || 'id';
            var search     = {};
            search[key]    = item[key];

            // Validate collection.
            if ( _.isNull(collection) || !_.isArray(collection) ) {
                window.log('shared-mixin.selectItem: Bad collection.');
                return;
            }

            // Validate Item
            if ( _.isNull(item) || !_.has(item, key) ) {
                window.log('shared-mixin.selectItem: Bad Item or no key.');
                return;
            }

            // Toggle item in collection (Add or delete).
            if ( self.isSelected(item, collection) ) {
                var index = _.findIndex(collection, search)
                window.log('Track', collction, index);
                collection.splice(index, 1);
            } else {
                self.setValue(collection, collection.length, item);
            }
        },
        setValue(obj, fields, value)
        {
            var self   = this;
            var fields = fields || null;
            var obj    = obj || self;
            var value  = _.isUndefined(value) ? '' : value; // false is a valid value!

            if ( !_.isObject(obj) ) {
                window.log('shared-methods-mixin.setValue: Cannot set fields to bad object.');
                return;
            }

            if ( _.isNull(value) || _.isNull(fields) ) {
                window.log('shared-methods-mixin.setValue: Cannot set fields with bad params.');
                return;
            }

            // Check for fields that is an index (collection update)
            if ( _.isNumber(fields) ) {
                var index = fields; // Just for readability.
                Vue.set(obj, index, value);
                window.log('shared-methods-mixin.setValue: Set ' + index + ' to :', value);
                return self;
            }

            // Check for multi-set.
            fields = (_.isArray(fields)) ? fields : [fields];
            _.each(fields, function(field){
                if ( _.isString(field) ) {
                    Vue.set(obj, field, value);
                    window.log('shared-methods-mixin.setValue: Set ' + field + ' to :', value, obj);
                }
            });
            return self;
        }
    }
}