module.exports = function(template) {
    return {
        render: template.r,
        staticRenderFns: template.s,
        data: function() {
            return {
                active: false,
            }
        },
        props: {
            id: {
                required: true,
                type: String,
            },
            title: {
                required: true,
                type: String,
            },
            isActive: {
                required: false,
                type: Boolean,
                default: false,
            },
        },
        methods: {
            removeTab: function() {
                this.$destroy()
            },
        },
        created: function() {
            this.active = this.isActive
            this.$parent.addTab(this)
        },
        watch: {

        },
    }
}
