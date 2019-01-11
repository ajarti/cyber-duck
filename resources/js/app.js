/**
 * Bootstrap that app. // That not the ccs lib :)
 */
require('./bootstrap');

/**
 * Create Global Event Bus
 */
window.EventBus = new Vue();

/**
 * Setup Libraries.
 */
Vue.use(Vuetify)
Vue.use(VueRouter);

/**
 * Views.
 */
import Companies from './components/companies';
import Dashboard from './components/dash';
import Employees from './components/employees';

let router = new VueRouter({
    routes : [
        { path : '/', component : Dashboard },
        { path : '/companies', component : Companies },
        { path : '/employees', component : Employees },
        { path : '*', redirect : '/' }
    ]
});

const app = new Vue({
    data    : {
        currentScreenWidth  : 0,
        currentScreenHeight : 0,
        snackAlert          : false,
        snackMessage        : '',
        snackTimeout : 3000
    },
    el      : '#app',
    methods : {
        gt(size)
        {
            var self = this;
            return (self.currentScreenWidth > size);
        },
        lt(size)
        {
            var self = this;
            return (self.currentScreenWidth < size);
        },
        logout()
        {
            window.log('Doing Logout');
            axios.post('/logout').then(function(response){
                window.log('Logged Out');
            });
        },
        init()
        {
            var self = this;

            window.addEventListener('resize', function(event){
                self.updateScreenSize()
            });

            Vue.nextTick(function(){
                self.updateScreenSize();
            });
        },
        isCurrentPath(path)
        {
            var self = this;
            return _.isEqual(self.$route.path, path);
        },
        showSnackMessage(data)
        {
            var self = this;
            var data = data || null;
            if ( !_.isNull(data) && _.has(data, 'message') ) {
                self.$set(self, 'snackMessage', data.message)
                self.$set(self, 'snackTimeout', data.timeout)
                self.$set(self, 'snackAlert', true)
            }
        },
        updateScreenSize()
        {
            var self = this;

            self.$set(self, 'currentScreenWidth',
                window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth
            );

            self.$set(self, 'currentScreenHeight',
                window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight
            );
        },
    },
    mounted()
    {
        var self = this;
        self.init();

        // Wait for snack messages.
        EventBus.$on('snackmessage', function(data){
            self.showSnackMessage(data)
        });

        window.log('Application Mounted.');
    },
    router
});
