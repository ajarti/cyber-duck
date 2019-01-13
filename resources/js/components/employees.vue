<template>
    <div>
        <v-layout wrap>
            <v-flex xs6>
                <v-text-field
                        prepend-icon="search"
                        v-model="query"
                        label="Search"
                        clearable
                ></v-text-field>
            </v-flex>
            <v-flex xs3>
                <v-checkbox
                        label="Show Deleted"
                        v-model="deleted"
                ></v-checkbox>
            </v-flex>
            <v-flex xs3 class="text-sm-right">
                <v-btn
                        color="primary"
                        class="white--text mt-3 mr-0"
                        @click="edit()"
                >
                    <v-icon small dark>add</v-icon>
                    Create
                </v-btn>
            </v-flex>
        </v-layout>

        <!--:total-items="paginator.totalItems" is needed for server-side pagination-->
        <v-data-table
                v-model="selected"
                :headers="headers"
                :items="employees"
                item-key="id"
                :loading="loadingEmployees"
                :rows-per-page-items="[5,10,25]"
                :pagination.sync="paginator"
                :total-items="paginator.totalItems"
                @update:pagination="loadEmployees"
        >
            <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
            <template slot="items" slot-scope="props">
                <v-hover>
                    <tr :active="props.selected" slot-scope="{ hover }">
                        <td class="pa-4">
                            <v-checkbox
                                    :disabled="isDeleted(props.item)"
                                    hide-details
                                    primary
                                    v-model="props.selected"
                            ></v-checkbox>
                        </td>
                        <td class="text-xs-left" :class="{deleted : isDeleted(props.item)}">
                            <a>
                                <span v-html="highlight(props.item.first_name)"></span>
                                <span v-html="highlight(props.item.last_name)"></span>
                            </a>
                            <div class="body-1 grey--text text--lighten-1">
                                <span v-html="highlight(props.item.company.name)"></span>
                            </div>
                        </td>
                        <td class="text-xs-left" :class="{deleted : isDeleted(props.item)}">
                            <span v-html="highlight(props.item.email)"></span>
                            <div class="body-1 grey--text text--lighten-1">
                                <span v-html="highlight(props.item.phone)"></span>
                            </div>
                        </td>
                        <td>
                            <v-speed-dial
                                    direction="left"
                                    open-on-hover
                                    transition="scale-transition"
                            >
                                <v-btn
                                        slot="activator"
                                        color="blue darken-2"
                                        dark
                                        fab
                                        flat
                                >
                                    <v-icon>more_vert</v-icon>
                                    <!--<v-icon>close</v-icon>-->
                                </v-btn>
                                <v-tooltip top>
                                    <v-btn
                                            fab
                                            dark
                                            small
                                            color="primary"
                                            @click="edit(props.item)"
                                            slot="activator"
                                    >
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                    <span>Edit</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <v-btn
                                            fab
                                            dark
                                            small
                                            color="error"
                                            @click="softDelete(props.item)"
                                            v-if="!isDeleted(props.item)"
                                            slot="activator"
                                    >
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                    <span>Delete</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <v-btn
                                            fab
                                            dark
                                            small
                                            color="success"
                                            @click="restore(props.item)"
                                            v-if="isDeleted(props.item)"
                                            slot="activator"
                                    >
                                        <v-icon>restore</v-icon>
                                    </v-btn>
                                    <span>Restore</span>
                                </v-tooltip>
                            </v-speed-dial>
                        </td>
                    </tr>
                </v-hover>
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
        mixins   : [ajaxMixin, sharedMethodsMixin],
        computed : {
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
                blankEmployee     : {
                    first_name : '',
                    last_name  : '',
                    email      : '',
                    phone      : '',
                    company    : {
                        id : 0
                    }
                },
                deleted           : false,
                deletingEmployee  : false,
                employees         : [],
                headers           : [
                    { text : '', width : '10%', class : 'blue lighten-5', sortable : false },
                    { text : 'EMPLOYEE', width : '40%', class : 'body-2 blue lighten-5', sortable : false },
                    { text : 'CONTACT DETAILS', width : '30%', class : 'body-2 blue lighten-5', sortable : false },
                    { text : '', width : '10%', class : 'body-2 blue lighten-5', sortable : false, },
                ],
                loadingEmployees  : false,
                masterCollection  : 'employees',
                query             : '',
                restoringEmployee : false,
                showEditor        : false,
            }
        },
        methods  : {
            edit(employee)
            {
                window.log(employee);
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
                    flag    : 'loadingEmployees'
                });
            },
            resetForm()
            {
                var self = this;
                self.$refs.form.reset()
            },
            resetValidation()
            {
                var self = this;
                self.$refs.form.resetValidation()
            },
            restore(employee)
            {
                var self     = this;
                var employee = employee || null;
                if ( self.restoringEmployee || (_.isNull(employee) && _.has(employee, 'id')) ) return;

                self.fetch({
                    url     : '/employee/restore',
                    data    : {
                        id : employee.id,
                    },
                    success : function({ data }){
                        if ( _.has(data, 'status') && data.status == 'success' ) {
                            self.loadEmployees();
                            self.setValue(self, 'showEditor', false);
                        }
                    },
                    flag    : 'restoringEmployee'
                });

            },
            softDelete(employee)
            {
                var self     = this;
                var employee = employee || null;
                if ( self.deletingEmployee || (_.isNull(employee) && _.has(employee, 'id')) ) return;

                self.fetch({
                    url     : '/employee/delete',
                    data    : {
                        id : employee.id,
                    },
                    success : function({ data }){
                        if ( _.has(data, 'status') && data.status == 'success' ) {
                            self.loadEmployees();
                            self.setValue(self, 'showEditor', false);
                        }
                    },
                    flag    : 'deletingEmployee'
                });

            },
        },
        mounted()
        {
            var self = this;
            self.loadEmployees();
            console.log('Employees mounted.')
        },
        watch    : {
            reloadTrigger()
            {
                var self = this;
                self.debouncedLoader('loadEmployees');
            }
        }
    }
</script>
