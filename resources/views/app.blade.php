@extends('layouts.app-base')

@section('override_css')
    <link href="https://transloadit.edgly.net/releases/uppy/v0.27.5/dist/uppy.min.css" rel="stylesheet">
@endsection

@section('content')
    <v-app id="app" v-cloak>
        <v-content>
            <v-container pa-0 grid-list-xl fill-height fluid>
                <v-layout>
                    <v-flex pa-0 xs12>
                        <v-card flat class="fill-height">
                            <v-toolbar color="blue darken-3" dark extended flat>

                                <v-spacer></v-spacer>
                                <v-tooltip left>
                                    <v-btn @click="$root.logout" icon slot="activator">
                                        <v-icon>power_settings_new</v-icon>
                                    </v-btn>
                                    <span>Logout</span>
                                </v-tooltip>
                            </v-toolbar>
                            <v-layout row pb-2 class="grey lighten-5">
                                <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
                                    <v-card class="card--flex-toolbar">
                                        <v-tabs
                                                centered
                                                color="blue darken-1"
                                                dark
                                                icons-and-text
                                                grow
                                        >
                                            <v-tabs-slider color="yellow"></v-tabs-slider>
                                            <v-tab to="/">
                                                <span :class="{caption : lt(680)}">Dashboard</span>
                                                <v-icon right dark class="mr-1 ml-0">dashboard</v-icon>
                                            </v-tab>
                                            <v-tab to="/companies">
                                                <span :class="{caption : lt(680)}">Companies</span>
                                                <v-icon right dark class="mr-1 ml-0">business</v-icon>
                                            </v-tab>
                                            <v-tab to="/employees">
                                                <span :class="{caption : lt(680)}">Employees</span>
                                                <v-icon right dark class="mr-1 ml-0">people</v-icon>
                                            </v-tab>
                                        </v-tabs>

                                        <v-divider></v-divider>

                                        <v-card-text :style="{minHeight : (currentScreenHeight-150) + 'px'}">
                                            <router-view></router-view>
                                        </v-card-text>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>

        {{--Snack Message--}}
        <v-snackbar
                v-model="snackAlert"
                :top="true"
                auto-height
                :timeout="snackTimeout"
                :color="snackStatus"
        >
            @{{ snackMessage }}
            <v-btn
                    color="white"
                    flat
                    @click="snackAlert = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </v-app>
@endsection

@section('javascripts')
    <script src="https://transloadit.edgly.net/releases/uppy/v0.27.5/dist/uppy.min.js"></script>
    <script src="{{ mix('js/app.js') }}"></script>
@endsection