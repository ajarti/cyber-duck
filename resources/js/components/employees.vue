<template>
    <div>
        <v-progress-linear :indeterminate="isLoading" class="ma-0"></v-progress-linear>
        <v-container>
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
                    :rows-per-page-items="[5,10,25]"
                    :pagination.sync="paginator"
                    :total-items="paginator.totalItems"
                    @update:pagination="loadEmployees"
            >
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
                                <a @click="edit(props.item)">
                                    <span v-html="highlight(props.item.first_name)"></span>
                                    <span v-html="highlight(props.item.last_name)"></span>
                                </a>
                                <div class="body-1 grey--text text--lighten-1">
                                    <span v-html="highlight(props.item.company.name || '')"></span>
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

            <v-dialog v-model="showEditor" persistent max-width="900px">
                <v-card>
                    <v-card-title
                            class="headline blue darken-2"
                            primary-title
                    >
                    <span class="headline font-weight-light text-uppercase white--text">
                        <span v-if="isDeleted(currentEmployee)">Restore</span>
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
                                            ref="form"
                                            v-model="formIsValid"
                                            lazy-validation
                                            autocomplete="off"
                                    >
                                        <!--v-if to ensure initialisation on each toggle.-->
                                        <v-layout wrap pa-3 v-if="showEditor">
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        counter="75"
                                                        :disabled="isDeleted(currentEmployee)"
                                                        :error-messages="errorMessages"
                                                        label="First Name*"
                                                        maxlength="75"
                                                        required
                                                        :rules="[rules.required]"
                                                        v-model="currentEmployee.first_name"
                                                        :autofocus="creating"
                                                        browser-autocomplete="off"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        counter="75"
                                                        :disabled="isDeleted(currentEmployee)"
                                                        :error-messages="errorMessages"
                                                        label="Last Name*"
                                                        maxlength="75"
                                                        required
                                                        :rules="[rules.required]"
                                                        v-model="currentEmployee.last_name"
                                                        :autofocus="creating"
                                                        browser-autocomplete="off"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        counter="64"
                                                        :disabled="isDeleted(currentEmployee)"
                                                        label="Email"
                                                        maxlength="64"
                                                        type="email"
                                                        :rules="[rules.email]"
                                                        v-model="currentEmployee.email"
                                                        browser-autocomplete="off"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-text-field
                                                        counter="50"
                                                        :disabled="isDeleted(currentEmployee)"
                                                        label="Phone Number"
                                                        maxlength="50"
                                                        v-model="currentEmployee.phone"
                                                        browser-autocomplete="off"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex x12>
                                                <!--<v-autocomplete-->
                                                        <!--v-model="currentEmployee.company_id"-->
                                                        <!--:items="companies"-->
                                                        <!--:loading="loading"-->
                                                        <!--:search-input.sync="companySearch"-->
                                                        <!--color="white"-->
                                                        <!--hide-no-data-->
                                                        <!--hide-selected-->
                                                        <!--item-text="Description"-->
                                                        <!--item-value="API"-->
                                                        <!--label="Public APIs"-->
                                                        <!--placeholder="Start typing to Search"-->
                                                        <!--prepend-icon="mdi-database-search"-->
                                                        <!--return-object-->
                                                <!--&gt;</v-autocomplete>-->
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>
                            <div class="font-weight-bold mb-2" v-if="isDeleted(currentEmployee)"> You will need to restore this employee before you can be edited them.</div>
                            * indicates a required field.
                        </small>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn :disabled="restoring" color="success darken-1" flat @click="restore(currentEmployee)" v-if="isDeleted(currentEmployee)">Restore</v-btn>
                        <v-btn :disabled="saving" color="blue darken-1" flat @click="save" v-else>Save</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="deleting" color="error darken-1" flat @click="softDelete(currentEmployee)" v-if="!isDeleted(currentEmployee) && updating">Delete</v-btn>
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
        mixins   : [ajaxMixin, formMixin, sharedMethodsMixin],
        computed : {
            // items()
            // {
            //     var self = this;
            //     return self.companies.map(company => {
            //         if (_.has(company,'name')){
            //             const name = company.name.length > this.companyNameLengthLimit
            //                 ? company.name.slice(0, this.companyNameLengthLimit) + '...'
            //                 : company.name
            //         }
            //         return Object.assign({}, company, { company });
            //     })
            // }
        },
        data()
        {
            return {
                blankObj               : {
                    first_name : '',
                    last_name  : '',
                    email      : '',
                    phone      : '',
                    company    : {
                        id : 0
                    }
                },
                companyNameLengthLimit : 60,
                companySearch          : '',
                currentObjType         : 'employee',
                currentEmployee        : {},
                headers                : [
                    { text : '', width : '10%', class : 'blue lighten-5', sortable : false },
                    { text : 'EMPLOYEE', width : '40%', class : 'body-2 blue lighten-5', sortable : false },
                    { text : 'CONTACT DETAILS', width : '30%', class : 'body-2 blue lighten-5', sortable : false },
                    { text : '', width : '10%', class : 'body-2 blue lighten-5', sortable : false, },
                ],
                masterCollection       : 'employees',


            }
        },
        methods  : {
            save()
            {

            },
        },
        mounted()
        {
            var self = this;
            self.setValue(self, 'collectionLoader', 'loadEmployees');
            self.debouncedLoader(self.collectionLoader);
            console.log('Employees mounted.')
        },

    }
</script>
