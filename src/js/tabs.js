module.exports = function(template) {
    return {
        beforeDestroy: function() {
            // Remove the event listener again after destroying the component.
            if (global.document) {
                global.removeEventListener('popstate', this.tabFromLocation)
            }
        },
        created: function() {
            this.setCurrentId()
            if (!this.currentId) this.currentId = this.tabs[0].id

            for (let tab of this.tabs) {
                if (tab.id === this.currentId) tab.active = true
                else tab.active = false
                if (!tab.hasOwnProperty('show')) {
                    tab.show = true
                }
            }

            // Register a custom event listener for back/forward events.
            if (global.document) {
                global.addEventListener('popstate', this.tabFromLocation)
            }
        },
        data: function() {
            return {
                currentId: null,
                uri: null,
            }
        },
        methods: {
            changeTab: function(e, tab) {
                e.preventDefault()
                // Directly modifies url's, bypassing the router, so the
                // route isn't getting replayed.
                if (global.document) {
                    global.history.pushState(null, null, tab.uri)
                }
                this.currentId = tab.id

                for (let _tab of this.tabs) {
                    if (_tab.id === tab.id) _tab.instance.active = true
                    else _tab.instance.active = false
                }
            },
            setCurrentId: function() {
                // Resolve the original route; not a possible alias.
                const aliasRoute = this.$router.currentRoute
                const aliasPath = aliasRoute.path

                const originalLocation = this.$router.resolve({
                    name: this.$router.currentRoute.name,
                    params: this.$router.currentRoute.params,
                })
                const originalRoute = originalLocation.route
                const originalPath = originalRoute.path

                for (let tab of this.tabs) {
                    tab.uri = `${originalLocation.href}/${tab.id}`
                    tab.path = `${originalRoute.path}/${tab.id}`
                }

                this.currentId = aliasPath.replace(originalPath, '').replace('/', '')
            },
            tabFromLocation: function(e) {
                this.setCurrentId()
                for (let _tab of this.tabs) {
                    if (_tab.id === this.currentId) _tab.instance.active = true
                    else _tab.instance.active = false
                }
            },
        },
        props: [
            'tabs',
        ],
        render: template.r,
        staticRenderFns: template.s,
    }
}
