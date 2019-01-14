module.exports = {
    data()
    {
        return {
            deleted       : 0,
            errorMessages : '',
            formIsValid   : true,
            rules         : {
                required : value => !!value || 'Required.',
                email    : value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return pattern.test(value) || 'Invalid or incomplete e-mail.';
                },
                url      : value => {
                    const pattern = /^(?:(?:(?:https?):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
                    return (pattern.test(value) || _.isEmpty(value)) || 'Invalid or incomplete website, E.g. https://my.website.com';
                },
                http     : value => {
                    const pattern = /^(http|https):\/\/(.*)/i;
                    return (pattern.test(value) || _.isEmpty(value)) || 'It should begin with http(s)://';
                }
            },
            showEditor    : false
        }
    },
    methods : {
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
        validate()
        {
            var self = this;
            return self.$refs.form.validate();
        },
    }
}