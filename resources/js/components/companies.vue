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

        <v-layout wrap>
            <v-flex xs12>
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
                        <v-hover>
                            <tr :active="props.selected" slot-scope="{ hover }">
                                <td class="pa-4">
                                    <v-checkbox
                                            v-model="props.selected"
                                            primary
                                            hide-details
                                            :disabled="isDeleted(props.item)"
                                    ></v-checkbox>
                                </td>
                                <td :class="{deleted : isDeleted(props.item)}">
                                    <v-avatar
                                            :size="50"
                                            color="grey lighten-4"
                                            tile
                                    >
                                        <img :src="'/storage/logos/'+props.item.logo">
                                    </v-avatar>
                                </td>
                                <td class="text-xs-left" :class="{deleted : isDeleted(props.item)}">
                                    <div><a @click="edit(props.item)" v-html="highlight(props.item.name || '')"></a></div>
                                    <div class="body-1 grey--text text--lighten-1">
                                        <span v-html="highlight(props.item.website)"></span>
                                    </div>
                                </td>
                                <td class="text-xs-left" :class="{deleted : isDeleted(props.item)}">
                                    <span v-html="highlight(props.item.email)"></span>

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
                    <v-alert slot="no-results" :value="true" color="red lighten-5" icon="warning">
                        Your search for "{{ query }}" found no companies.
                        <span v-if="!deleted"> There may be deleted matched, try enabling 'Show Deleted' above.</span>
                    </v-alert>
                </v-data-table>
            </v-flex>
        </v-layout>

        <v-dialog v-model="showEditor" persistent max-width="800px">
            <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
            <v-card>
                <v-card-title
                        class="headline blue darken-2"
                        primary-title
                >
                    <span class="headline font-weight-light text-uppercase white--text">
                        <span v-if="isDeleted(currentCompany)">Restore</span>
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
                            <v-flex xs12 sm6>
                                <v-form
                                        ref="form"
                                        v-model="companyValid"
                                        lazy-validation
                                >
                                    <v-layout wrap pa-3>
                                        <v-flex xs12>
                                            <v-text-field
                                                    counter="75"
                                                    :disabled="isDeleted(currentCompany)"
                                                    :error-messages="errorMessages"
                                                    label="Name*"
                                                    maxlength="75"
                                                    required
                                                    :rules="[rules.required]"
                                                    v-model="currentCompany.name"
                                            >
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field
                                                    counter="64"
                                                    :disabled="isDeleted(currentCompany)"
                                                    label="Email"
                                                    maxlength="64"
                                                    required
                                                    :rules="[rules.email]"
                                                    v-model="currentCompany.email"
                                            >
                                            </v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field
                                                    :disabled="isDeleted(currentCompany)"
                                                    label="Website"
                                                    prefix="http://"
                                                    required
                                                    v-model="currentCompany.website"
                                            >
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-form>
                            </v-flex>
                            <v-flex xs12 sm6 pa-3 style="min-height: 500px">
                                <v-card raised v-show="isDeleted(currentCompany) && updating" fluid>
                                    <v-img :src="currentLogo" :contain="true"></v-img>
                                </v-card>
                                <div v-show="!isDeleted(currentCompany)">
                                    <cd-uploader
                                            :currentImage="currentLogo"
                                            :allowedTypes="['image/jpeg', 'image/png']"
                                            browse="select an image file"
                                            note="Please upload the company's logo in either PNG or JPG format, minimum 400 x 400 pixels."
                                            @snackMessage="alert($event,'success')"
                                            @oops="alert($event,'warning',5000)"
                                            @fileName="currentCompany.logo = $event"
                                    >
                                        <span slot="changeFile">Change Logo</span>
                                        <span slot="rememberToSave">
                                            <strong class="red--text"> N.B.</strong> Remember to save this company to have the logo saved to the database.
                                        </span>
                                    </cd-uploader>
                                </div>
                            </v-flex>
                        </v-layout>


                        <!--<v-layout wrap>-->
                        <!--<v-flex xs12 sm6 md4>-->
                        <!--<v-text-field label="Legal first name*" required></v-text-field>-->
                        <!--</v-flex>-->
                        <!--<v-flex xs12 sm6 md4>-->
                        <!--<v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>-->
                        <!--</v-flex>-->
                        <!--<v-flex xs12 sm6 md4>-->
                        <!--<v-text-field-->
                        <!--label="Legal last name*"-->
                        <!--hint="example of persistent helper text"-->
                        <!--persistent-hint-->
                        <!--required-->
                        <!--&gt;</v-text-field>-->
                        <!--</v-flex>-->
                        <!--<v-flex xs12>-->
                        <!--<v-text-field label="Email*" required></v-text-field>-->
                        <!--</v-flex>-->
                        <!--<v-flex xs12>-->
                        <!--<v-text-field label="Password*" type="password" required></v-text-field>-->
                        <!--</v-flex>-->
                        <!--<v-flex xs12 sm6>-->
                        <!--<v-select-->
                        <!--:items="['0-17', '18-29', '30-54', '54+']"-->
                        <!--label="Age*"-->
                        <!--required-->
                        <!--&gt;</v-select>-->
                        <!--</v-flex>-->
                        <!--<v-flex xs12 sm6>-->
                        <!--<v-autocomplete-->
                        <!--:items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"-->
                        <!--label="Interests"-->
                        <!--multiple-->
                        <!--&gt;</v-autocomplete>-->
                        <!--</v-flex>-->
                        <!--</v-layout>-->
                    </v-container>
                    <small>
                        <div class="font-weight-bold mb-2" v-if="isDeleted(currentCompany)"> You will need to restore this company before it can be edited.</div>
                        *indicates required field.
                    </small>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-btn color="success darken-1" flat @click="restore(currentCompany)" v-if="isDeleted(currentCompany)">Restore</v-btn>
                    <v-btn color="blue darken-1" flat @click="update" v-else>Save</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="error darken-1" flat @click="softDelete(currentCompany)" v-if="!isDeleted(currentCompany) && updating">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>


<script>

    // Uploader Component
    import CDUploader from '../components/uploader';

    Vue.component('cd-uploader', CDUploader);

    // Mixins
    import ajaxMixin from '../ajax-mixin';
    import sharedMethodsMixin from '../shared-methods-mixin';

    export default {
        mixins   : [ajaxMixin, sharedMethodsMixin],
        computed : {
            currentLogo()
            {
                var self     = this;
                var logoPath = '';
                if ( _.has(self, 'currentCompany.logo') && !_.isEmpty(self.currentCompany.logo) ) {
                    logoPath = '/storage/logos/' + self.currentCompany.logo + '?' + Math.random();
                    // logoPath = '/storage/logos/square_' + self.company.logo + '?' + Math.random();
                }
                return logoPath;
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
                blankCompany     : {
                    name    : '',
                    email   : '',
                    logo    : '',
                    website : ''
                },
                companies        : [],
                companyValid     : true,
                currentCompany   : {},
                deleted          : 0,
                deletingCompany  : false,
                errorMessages    : '',
                headers          : [
                    { text : '', sortable : false, class : 'blue lighten-5', width : '10%', sortable : false, },
                    { text : 'LOGO', width : '10%', class : 'body-2 blue lighten-5', sortable : false, },
                    { text : 'COMPANY NAME', width : '30%', class : 'body-2 blue lighten-5', sortable : false, },
                    { text : 'EMAIL', width : '30%', class : 'body-2 blue lighten-5', sortable : false, },
                    { text : '', width : '10%', class : 'body-2 blue lighten-5', sortable : false, },
                ],
                loadingCompanies : false,
                masterCollection : 'companies',
                originalCompany  : {},
                query            : '',
                restoringCompany : false,
                rules            : {
                    required : value => !!value || 'Required.',
                    email    : value => {
                        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                        return pattern.test(value) || 'Invalid e-mail.'
                    }
                },
                showEditor       : false
            }
        },
        methods  : {
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
                    flag    : 'loadingCompanies'
                });
            },
            edit(company)
            {
                var self    = this;
                var company = company || null;

                // Reset.
                self.resetForm();
                self.resetValidation();
                self.setValue(self, 'currentCompany', _.clone(self.blankCompany));
                self.setValue(self, 'originalCompany', _.clone(self.blankCompany));

                // Create/Update?
                if ( _.isNull(company) ) {
                    self.setValue(self, 'action', 'create');
                } else {
                    self.setValue(self, 'action', 'update');
                    self.setValue(self, 'currentCompany', _.clone(company));
                    self.setValue(self, 'originalCompany', _.clone(company));
                }

                // Edit.
                self.setValue(self, 'showEditor', true);
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
            restore(company)
            {
                var self    = this;
                var company = company || null;
                if ( self.restoringCompany || (_.isNull(company) && _.has(company, 'id')) ) return;

                self.fetch({
                    url     : '/company/restore',
                    data    : {
                        id : company.id,
                    },
                    success : function({ data }){
                        if ( _.has(data, 'status') && data.status == 'success' ) {
                            self.loadCompanies();
                            self.setValue(self, 'showEditor', false);
                        }
                    },
                    flag    : 'restoringCompany'
                });

            },
            softDelete(company)
            {
                var self    = this;
                var company = company || null;
                if ( self.deletingCompany || (_.isNull(company) && _.has(company, 'id')) ) return;

                self.fetch({
                    url     : '/company/delete',
                    data    : {
                        id : company.id,
                    },
                    success : function({ data }){
                        if ( _.has(data, 'status') && data.status == 'success' ) {
                            self.loadCompanies();
                            self.setValue(self, 'showEditor', false);
                        }
                    },
                    flag    : 'deletingCompany'
                });

            },
            update()
            {

            },
            validate()
            {
                var self = this;
                return self.$refs.form.validate();
            },
        },
        mounted()
        {
            var self = this;
            self.loadCompanies();
            window.log('Companies mounted.')
        },
        watch    : {
            reloadTrigger()
            {
                var self = this;
                self.debouncedLoader('loadCompanies');
            }
        }
    }
</script>
