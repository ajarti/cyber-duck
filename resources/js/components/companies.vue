<template>
    <div>
        <v-progress-linear :indeterminate="isLoading" class="ma-0"></v-progress-linear>
        <v-container>
            <v-layout wrap>
                <v-flex class="xs12 font-weight-light display-1 py-4">
                    COMPANIES
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
                            :items="companies"
                            item-key="id"
                            :rows-per-page-items="[5,10,25]"
                            :pagination.sync="paginator"
                            :total-items="paginator.totalItems"
                            @update:pagination="loadCompanies"
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
                                    <td :class="{deleted : isDeleted(props.item)}">
                                        <v-avatar
                                                :size="50"
                                                color="grey lighten-4"
                                                tile
                                        >
                                            <img :src="companyLogo(props.item)">
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
                                    <td class="text-xs-center" :class="{deleted : isDeleted(props.item)}">
                                        <v-tooltip top>
                                            <v-btn icon
                                                   :to="'/employees?q='+props.item.name+'&d='+(props.item.deleted ? 1 : 0)"
                                                   slot="activator"
                                            >
                                                <v-icon color="primary">contact_mail</v-icon>
                                            </v-btn>
                                            <span>Show Employees</span>
                                        </v-tooltip>
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
                        <v-btn icon dark flat @click="closeEditor">
                            <v-icon>close</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6>
                                    <v-form
                                            ref="form"
                                            v-model="formIsValid"
                                            lazy-validation
                                            autocomplete="off"
                                    >
                                        <!--v-if to ensure initialisation on each toggle.-->
                                        <v-layout wrap pa-3 v-if="showEditor">
                                            <v-flex xs12>
                                                <v-text-field
                                                        counter="75"
                                                        :disabled="isDeleted(currentObj)"
                                                        :error-messages="errorMessages"
                                                        label="Company Name*"
                                                        maxlength="75"
                                                        required
                                                        :rules="[rules.required]"
                                                        v-model="currentObj.name"
                                                        :autofocus="creating"
                                                        browser-autocomplete="off"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 mt-3>
                                                <v-text-field
                                                        counter="64"
                                                        :disabled="isDeleted(currentObj)"
                                                        label="Email"
                                                        maxlength="64"
                                                        type="email"
                                                        :rules="[rules.email]"
                                                        v-model="currentObj.email"
                                                        browser-autocomplete="off"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                            <v-flex xs12 mt-3>
                                                <v-text-field
                                                        counter="50"
                                                        :disabled="isDeleted(currentObj)"
                                                        label="Website"
                                                        maxlength="50"
                                                        :rules="[rules.http,rules.url]"
                                                        v-model="currentObj.website"
                                                        browser-autocomplete="off"
                                                >
                                                </v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-form>
                                </v-flex>
                                <v-flex xs12 sm6 pa-3 style="min-height: 500px">
                                    <v-card raised v-show="isDeleted(currentObj) && updating" fluid>
                                        <v-img :src="currentLogo" :contain="true"></v-img>
                                    </v-card>
                                    <div v-show="!isDeleted(currentObj)">
                                        <cd-uploader
                                                :currentImage="currentLogo"
                                                :allowedTypes="['image/jpeg', 'image/png']"
                                                browse="select an image file"
                                                note="Please upload the company's logo in either PNG or JPG format, minimum 400 x 400 pixels."
                                                :resetUploader='resetTimeStamp'
                                                @snackMessage="alert($event,'success')"
                                                @oops="alert($event,'warning',5000)"
                                                @uploadPending="toggleUploadPending($event)"
                                                @fileName="currentObj.new_logo = $event"
                                        >
                                            <span slot="changeFile">Change Logo</span>
                                            <span slot="rememberToSave">
                                            <strong class="red--text"> N.B.</strong> Remember to save this company to have the logo saved to the database.
                                        </span>
                                        </cd-uploader>
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <small>
                            <div class="font-weight-bold mb-2" v-if="isDeleted(currentObj)"> You will need to restore this company before it can be edited.</div>
                            * indicates a required field.
                        </small>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-btn :disabled="restoring" color="success darken-1" flat @click="restore(currentObj)" v-if="isDeleted(currentObj)">Restore</v-btn>
                        <div v-else>
                            <span v-if="uploadPending">
                                <span class="gray--text my-2">Please upload logo to continue</span>
                                 <v-btn small color="blue darken-1" flat @click="uploadPending = false" v-if="uploadPending">Ignore logo change</v-btn>
                            </span>
                            <v-btn :disabled="saving" color="blue darken-1" flat @click="save" v-else>
                                Save
                            </v-btn>

                        </div>

                        <v-spacer></v-spacer>
                        <v-btn :disabled="deleting" color="error darken-1" flat @click="softDelete(currentObj)" v-if="!isDeleted(currentObj) && updating">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog
                    v-model="closeWithPendingUpload"
                    max-width="290"
            >
                <v-card>
                    <v-card-title class="headline">Are you sure?</v-card-title>
                    <v-card-text class="text-sm-center">
                        <div class="text--blue">You have selected a new logo, but you have not uploaded it.</div>
                        <div class="subheading font-weight-bold mt-3">Continue to close the editor?</div>

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                                color="green darken-1"
                                flat="flat"
                                @click="closeWithPendingUpload = false"
                        >
                            Oops, No!
                        </v-btn>

                        <v-btn
                                color="green darken-1"
                                flat="flat"
                                @click="closeEditor('yes')"
                        >
                            Yes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>


<script>

    // Uploader Component
    import CDUploader from '../components/uploader';

    Vue.component('cd-uploader', CDUploader);

    // Mixins
    import ajaxMixin from '../ajax-mixin';
    import formMixin from '../form-mixin';
    import sharedMethodsMixin from '../shared-methods-mixin';

    export default {
        mixins   : [ajaxMixin, formMixin, sharedMethodsMixin],
        computed : {
            currentLogo()
            {
                var self     = this;
                var logoPath = '';
                if ( _.has(self, 'currentObj.logo') && !_.isEmpty(self.currentObj.logo) ) {
                    return logoPath = '/logo/square_' + self.currentObj.logo + '?' + Math.random();
                }
                return '';
            }
        },
        data()
        {
            return {
                blankObj               : {
                    name     : '',
                    email    : '',
                    logo     : '',
                    new_logo : '',
                    website  : ''
                },
                closeWithPendingUpload : false,
                currentObjType         : 'company',
                headers                : [
                    // { text : '', width : '10%', class : 'blue lighten-5', sortable : false, },
                    { text : 'LOGO', width : '10%', class : 'body-2 blue lighten-5', sortable : false, },
                    { text : 'COMPANY NAME', width : '30%', class : 'body-2 blue lighten-5', sortable : false, },
                    { text : 'EMAIL', width : '30%', class : 'body-2 blue lighten-5', sortable : false, },
                    { text : 'EMPLOYEES', width : '20%', class : 'body-2 blue lighten-5', sortable : false, },
                    { text : '', width : '10%', class : 'body-2 blue lighten-5', sortable : false, },
                ],
                masterCollection       : 'companies',
                resetTimeStamp         : 0,
                uploadPending          : false,
            }
        },
        methods  : {
            closeEditor(force)
            {
                var self  = this;
                var force = force || 'no';

                if ( self.uploadPending && (force != 'yes') ) {
                    self.setValue(self, 'closeWithPendingUpload', true);
                } else {
                    self.setValue(self, 'uploadPending', false);
                    self.setValue(self, 'closeWithPendingUpload', false);
                    self.setValue(self, 'showEditor', false);
                }
            },
            companyLogo(company)
            {
                var self    = this;
                var company = company || null;
                if ( _.isNull(company) || !_.has(company, 'logo' || _.isEmpty(company.logo)) ) {
                    return '/logo/logo-placeholder.png';
                }
                return '/logo/square_' + company.logo + '?nc=' + Math.random();
            },
            toggleUploadPending(status)
            {
                var self = this;
                self.setValue(self, 'uploadPending', status);
            },
            save()
            {
                var self = this;

                // Stop multiple submissions.
                if ( self.saving || self.uploadPending ) return;

                // Check all OK.
                if ( !this.$refs.form.validate() ) {
                    self.alert('Please check the company details and correct an issues.', 'warning')
                    return;
                }

                // Setup data.
                var url  = '/company/create';
                var data = {
                    email    : self.getStringValue('currentObj.email'),
                    name     : self.getStringValue('currentObj.name'),
                    logo     : self.getStringValue('currentObj.logo'),
                    new_logo : self.getStringValue('currentObj.new_logo'),
                    website  : self.getStringValue('currentObj.website')
                }

                // Override if editing.
                if ( self.updating ) {
                    url = '/company/update';
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
                            self.closeEditor();
                        }
                    },
                    flag    : 'saving'
                });
            }
        },
        mounted()
        {
            var self = this;

            // Check for filters
            if ( _.has(self.$route, 'query.q') ) {
                self.setValue(self, 'query', self.$route.query.q);
            }
            if ( _.has(self.$route, 'query.d') ) {
                self.setValue(self, 'deleted', self.$route.query.d);
            }

            self.setValue(self, 'collectionLoader', 'loadCompanies');
            self.debouncedLoader(self.collectionLoader);
            window.log('Companies mounted.')
        },
        watch    : {
            showEditor(val)
            {
                var self = this;
                if ( !val ) {
                    setTimeout(function(){
                        self.setValue(self, 'resetTimeStamp', (new Date()).getMilliseconds());
                    }, 1000);
                }
            }
        }
    }
</script>
