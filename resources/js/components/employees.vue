<template>
    <div>
        <div>
            <v-text-field
                    prepend-icon="search"
                    v-model="query"
                    label="Search"
                    clearable
            ></v-text-field>
        </div>

        <!--:total-items="paginator.totalItems" is needed for server-side pagination-->
        <v-data-table
                v-model="selected"
                :headers="headers"
                :items="employees"
                item-key="id"
                :rows-per-page-items="[5,10,25]"
                :loading="loadingEmployees"
                :pagination.sync="paginator"
                :total-items="paginator.totalItems"
                @update:pagination="loadEmployees"
        >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
                <tr :active="props.selected">
                    <td class="pa-4">
                        <v-checkbox
                                v-model="props.selected"
                                primary
                                hide-details
                        ></v-checkbox>
                    </td>
                    <td class="text-xs-left">
                        <a>{{ props.item.first_name }} {{ props.item.last_name }}</a>
                        <div class="body-1 grey--text text--lighten-1">
                            {{ props.item.email }}
                        </div>
                    </td>
                    <td class="text-xs-left">{{ props.item.phone }}</td>
                </tr>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ query }}" found no employees.
            </v-alert>
        </v-data-table>
    </div>
</template>


<script>

    // Mixins
    import ajaxMixin from '../ajax-mixin';
    import sharedMethodsMixin from '../shared-methods-mixin';

    export default {
        mixins  : [ajaxMixin, sharedMethodsMixin],
        data()
        {
            return {
                employees        : [],
                headers          : [
                    { text : '', sortable : false, width : '10%', sortable : false, },
                    { text : 'EMPLOYEE', width : '50%', class : 'body-2', sortable : false, },
                    { text : 'EMAIL', width : '30%', class : 'body-2', sortable : false, },
                ],
                loadingEmployees : false,
                masterCollection : 'employees',
                query            : '',
            }
        },
        methods : {
            loadEmployees()
            {
                var self = this;
                self.fetch({
                    url     : '/employees/search',
                    data    : {
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
                    flag    : 'loadingEmployees'
                });
            }
        },
        mounted()
        {
            var self = this;
            self.loadEmployees();
            console.log('Employees mounted.')
        },
        watch   : {
            query(newQuery)
            {
                var self = this;
                self.debouncedLoader('loadEmployees');
            }
        }
    }
</script>
