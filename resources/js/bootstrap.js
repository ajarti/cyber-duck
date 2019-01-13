/**
 * Setup Debugging.
 * usage: log('inside coolFunc',this,arguments); http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 */
window.debugLS = true;
window.log = function(){
    if ( !window.edb ) return;
    log.history = log.history || [];   // store logs to an array for reference
    log.history.push(arguments);
    if ( this.console ) {
        console.log(Array.prototype.slice.call(arguments));
    }
    // console.trace('callers ..'); // (if backtrace is needed.)
};

/**
 * Axios for XHR
 */

window.axios = require('axios');

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Catch Ajax errors.
window.axios.interceptors.response.use((response) => {
    return response
}, function(error){
    let originalRequest = error.config

    // Logged out (no auth)
    if ( error.response.status === 401 ||  error.response.status === 419 ) {
        window.location.href = '/';
        return
    }

    // Do something with response error
    return Promise.reject(error)
})

/**
 * CSRF Injection.
 */

let token = document.head.querySelector('meta[name="csrf-token"]');

if ( token ) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}