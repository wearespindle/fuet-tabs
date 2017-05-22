const qs = require('mini-querystring')

module.exports = function(template) {
    return {
        render: template.r,
        staticRenderFns: template.s,
        data: function() {
            return {
                tabs: [],
                current: null,
            }
        },
        methods: {
            addTab: function(tab) {
                this.tabs.push(tab)
                let searchState = qs.parse(location.search)
                if (tab.id === searchState.tabid) {
                    this.current = tab
                    tab.active = true
                }
            },
            changeTab: function(tab) {
                this.current = tab
                let searchState = qs.parse(location.search)
                searchState.tabid = tab.id
                window.history.pushState(null, null, `?${qs.stringify(searchState)}`)

                for (let _tab of this.tabs) {
                    if (_tab === tab) {
                        // Push the url state when using Vue-Router.
                        _tab.active = true
                    } else {
                        _tab.active = false
                    }
                }
            },
            removeTab: function(tab) {
                let index = this.tabs.indexOf(tab)
                this.tabs.splice(index, 1)
                this.$el.removeChild(tab.$el)
                tab.removeTab()
                if (this.tabs[0]) {
                    this.changeTab(this.tabs[0])
                }
            },
        },
        mounted: function() {
            // Set active
            let searchState = qs.parse(location.search)
            if (!searchState.tabid) {
                // Set first tab active if no tabid is in the querystring.
                this.current = this.tabs[0]
                this.tabs[0].active = true
            }
        },
    }
}
