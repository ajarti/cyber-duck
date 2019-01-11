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
                :items="companies"
                item-key="id"
                :loading="loadingCompanies"
                :rows-per-page-items="[5,10,25]"
                :pagination.sync="paginator"
                :total-items="paginator.totalItems"
                @update:pagination="loadCompanies"
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
                    <td>
                        <v-avatar
                                :size="50"
                                color="grey lighten-4"
                        >
                            <img :src="'/storage/logos/'+props.item.logo">
                        </v-avatar>
                    </td>
                    <td class="text-xs-left">
                        <a>{{ props.item.name }}</a>
                        <div class="body-1 grey--text text--lighten-1">
                            {{ props.item.website }}
                        </div>
                    </td>
                    <td class="text-xs-left">{{ props.item.email }}</td>
                </tr>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ query }}" found no companies.
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
                companies        : [],
                headers          : [
                    { text : '', sortable : false, width : '10%', sortable : false, },
                    { text : 'LOGO', width : '10%', class : 'body-2', sortable : false, },
                    { text : 'COMPANY NAME', width : '50%', class : 'body-2', sortable : false, },
                    { text : 'EMAIL', width : '30%', class : 'body-2', sortable : false, },
                ],
                loadingCompanies : false,
                masterCollection : 'companies',
                query            : '',
            }
        },
        methods : {
            loadCompanies()
            {
                var self = this;
                self.fetch({
                    url     : '/companies/search',
                    data    : {
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
                    flag    : 'loadingCompanies'
                });
            }
        },
        mounted()
        {
            var self = this;
            self.loadCompanies();
            window.log('Companies mounted.')
        },
        watch   : {
            query(newQuery)
            {
                var self = this;
                self.debouncedLoader('loadCompanies');
            }
        }
    }
</script>
