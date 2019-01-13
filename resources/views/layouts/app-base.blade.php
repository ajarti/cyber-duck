<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', '') }}</title>

    <!-- DNS -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="dns-prefetch" href="//unpkg.com">

    <!-- Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons' rel="stylesheet">

    <!-- Styles -->
    <style>
        [v-cloak] {
            display: none !important;
        }

        .card--flex-toolbar {
            margin-top: -80px;
        }
    </style>
    <link type="text/css" rel="stylesheet" href="//unpkg.com/vuetify@1.4.1/dist/vuetify.min.css"/>
    <link type="text/css" rel="stylesheet" href="{{ mix('css/styles.css') }}"/>
    @yield('override_css')

</head>
<body>

    @yield('content')

    <!-- Scripts -->
    <script>
        window.edb = {{ env('APP_DEBUG') ? 1 :  0 }};
    </script>
    <script src="https://unpkg.com/vue@2.5.21/dist/vue.js"></script>
    {{--<script src="https://unpkg.com/vue@2.5.21/dist/vue.min.js"></script>--}}
    <script src="https://unpkg.com/vue-router@3.0.2/dist/vue-router.min.js"></script>
    <script src="//unpkg.com/vuetify@1.4.1/dist/vuetify.min.js"></script>
    <script src="//unpkg.com/lodash@4.17.11/lodash.min.js"></script>
    <script src="//unpkg.com/babel-polyfill@latest/dist/polyfill.min.js"></script>
    @yield('javascripts')

</body>
</html>
