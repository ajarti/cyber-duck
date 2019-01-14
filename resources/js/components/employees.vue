<template>
    <div>
        <v-progress-linear :indeterminate="isLoading" class="ma-0"></v-progress-linear>
        <v-container>
            <v-layout wrap>
                <v-flex class="xs12 font-weight-light display-1 py-4">
                    EMPLOYEES
                </v-flex>
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

            <v-layout wrap mt-2>
                <v-flex xs12>
                    <!--:total-items="paginator.totalItems" is needed for server-side pagination-->
                    <v-data-table
                            v-model="selected"
                            :headers="headers"
                            :items="employees"
                            item-key="id"
                            :rows-per-page-items="[5,10,25]"
                            :pagination.sync="paginator"
                            :total-items="paginator.totalItems"
                            @update:pagination="loadEmployees"
                    >
                        <template slot="items" slot-scope="props">
                            <v-hover>
                                <tr :active="props.selected" slot-scope="{ hover }">
                                    <!--<td class="pa-4">-->
                                    <!--<v-checkbox-->
                                    <!--:disabled="isDeleted(props.item)"-->
                                    <!--hide-details-->
                                    <!--primary-->
                                    <!--v-model="props.selected"-->
                                    <!--&gt;</v-checkbox>-->
                                    <!--</td>-->
                                    <td class="text-xs-left" :class="{deleted : isDeleted(props.item)}">
                                        <a @click="edit(props.item)">
                                            <span v-html="highlight(props.item.first_name)"></span>
                                            <span v-html="highlight(props.item.last_name)"></span>
                                        </a>
                                        <div class="body-1 grey--text text--lighten-1">
                                            <span v-html="highlight(companyName(props.item))"></span>
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
                            <span v-if="!deleted"> There may be deleted match, try enabling 'Show Deleted' above.</span>
                        </v-alert>
                    </v-data-table>
                </v-flex>
            </v-layout>

            <v-dialog v-model="showEditor" persistent max-width="900px">
                <v-card>
                    <v-card-title
                            class="headline blue darken-2"
                            primary-title
                    >
                    <span class="headline font-weight-light text-uppercase white--text">
                        <span v-if="isDeleted(currentObj)">Restore</span>
                        <span v-else v-text="action"></span>
                        Company
                    </span>
                        <v-spacer></v-spacer>
                        <v-btn icon dark flat @click="showEditor = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <v-form
                                            autocomplete="off"
                                            autofill="off"
                                            ref="form"
                                            v-model="formIsValid"
                                            lazy-validation
                                    >
                                        <!--v-if to ensure initialisation on each toggle.-->
                                        <v-layout wrap pa-3 v-if="showEditor">
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        :autofocus="creating"
                                                        browser-autocomplete="off"
                                                        counter="75"
                                                        :disabled="isDeleted(currentObj)"
                                                        :error-messages="errorMessages"
                                                        label="First Name*"
                                                        maxlength="75"
                                                        required
                                                        :rules="[rules.required]"
                                                        v-model="currentObj.first_name"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        browser-autocomplete="off"
                                                        counter="75"
                                                        :disabled="isDeleted(currentObj)"
                                                        :error-messages="errorMessages"
                                                        label="Last Name*"
                                                        maxlength="75"
                                                        required
                                                        :rules="[rules.required]"
                                                        v-model="currentObj.last_name"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 mt-3>
                                                <v-text-field
                                                        browser-autocomplete="off"
                                                        counter="64"
                                                        :disabled="isDeleted(currentObj)"
                                                        label="Email"
                                                        maxlength="64"
                                                        :rules="[rules.email]"
                                                        type="email"
                                                        v-model="currentObj.email"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 mt-3>
                                                <v-text-field
                                                        browser-autocomplete="off"
                                                        counter="50"
                                                        :disabled="isDeleted(currentObj)"
                                                        label="Phone Number"
                                                        maxlength="50"
                                                        v-model="currentObj.phone"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex x12 mt-3>
                                                <v-autocomplete
                                                        autofill="off"
                                                        browser-autocomplete="off"
                                                        clearable
                                                        :disabled="isDeleted(currentObj)"
                                                        :items="autocompleteCompanies"
                                                        hide-no-data
                                                        item-text="name"
                                                        item-value="id"
                                                        label="Company"
                                                        :loading="loading"
                                                        placeholder="Start typing to search"
                                                        return-object
                                                        :rules="[rules.hasId]"
                                                        :search-input.sync="companyAutocompleteSearch"
                                                        v-model="currentObj.company"
                                                ></v-autocomplete>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>
                            <div class="font-weight-bold mb-2" v-if="isDeleted(currentObj)">
                                <div v-if="currentObj.company.deleted">
                                    <a :href="'/app#/companies?d=1&q='+currentObj.company.name" v-text="currentObj.company.name"></a> is currently deleted, you will need to restore this company before you can edit this employee.
                                </div>
                                <div v-else>
                                    You will need to restore this employee before they can be edited.
                                </div>
                            </div>
                            * indicates a required field.
                        </small>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn :disabled="restoring" color="success darken-1" flat @click="restore(currentObj)" v-if="isDeleted(currentObj)">Restore</v-btn>
                        <v-btn :disabled="saving" color="blue darken-1" flat @click="save" v-else>Save</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="deleting" color="error darken-1" flat @click="softDelete(currentObj)" v-if="!isDeleted(currentObj) && updating">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>


<script>

    // Mixins
    import ajaxMixin from '../ajax-mixin';
    import formMixin from '../form-mixin';
    import sharedMethodsMixin from '../shared-methods-mixin';

    export default {
        mixins  : [ajaxMixin, formMixin, sharedMethodsMixin],
        data()
        {
            return {
                blankObj         : {
                    first_name : '',
                    last_name  : '',
                    email      : '',
                    phone      : '',
                    company    : {}
                },
                currentObjType   : 'employee',
                headers          : [
                    // { text : '', width : '10%', class : 'blue lighten-5', sortable : false },
                    { text : 'EMPLOYEE', width : '50%', class : 'body-2 blue lighten-5', sortable : false },
                    { text : 'CONTACT DETAILS', width : '40%', class : 'body-2 blue lighten-5', sortable : false },
                    { text : '', width : '10%', class : 'body-2 blue lighten-5', sortable : false, },
                ],
                masterCollection : 'employees',
            }
        },
        methods : {
            companyName(employee)
            {
                var self     = this;
                var employee = employee || null;
                if ( _.isNull(employee) || !_.has(employee, 'company.name') ) return '';

                return (employee.company.deleted) ? employee.company.name + ' [Deleted] ' : employee.company.name;
            },
            save()
            {
                var self = this;

                // Stop multiple submissions.
                if ( self.saving ) return;

                // Check all OK.
                if ( !this.$refs.form.validate() ) {
                    self.alert('Please check the employee details and correct an issues.', 'warning')
                    return;
                }

                // Setup data.
                var url  = '/employee/create';
                var data = {
                    email      : self.getStringValue('currentObj.email'),
                    first_name : self.getStringValue('currentObj.first_name'),
                    last_name  : self.getStringValue('currentObj.last_name'),
                    phone      : self.getStringValue('currentObj.phone'),
                    company_id : self.getNumericValue('currentObj.company.id')
                }

                // Override if editing.
                if ( self.updating ) {
                    url = '/employee/update';
                    _.merge(data, {
                        id : self.getNumericValue('currentObj.id')
                    })
                }

                self.fetch({
                    url     : url,
                    data    : data,
                    success : function({ data }){
                        if ( _.has(data, 'status') && data.status == 'success' ) {
                            if ( self.creating ) {
                                self.setValue(self, 'query', '');
                                self.setValue(self, 'deleted', 0);
                            }
                            self.debouncedLoader(self.collectionLoader);
                            self.setValue(self, 'showEditor', false);
                        }
                    },
                    flag    : 'saving'
                });

            },
        },
        mounted()
        {
            var self = this;

            // Check for filters
            if ( _.has(self.$route, 'query.q') ) {
                self.setValue(self, 'query', self.$route.query.q);
            }
            if ( _.has(self.$route, 'query.d') && (self.$route.query.d == 1) ) {
                self.setValue(self, 'deleted', 1);
            }

            self.setValue(self, 'collectionLoader', 'loadEmployees');
            self.debouncedLoader(self.collectionLoader);
            self.debouncedLoader('loadCompanies');
            console.log('Employees mounted.')
        },

    }
</script>
