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
            changeTab: function(tabid, pushState) {
                let searchState = qs.parse(location.search)
                for (let _tab of this.tabs) {
                    if (_tab.id === tabid) {
                        _tab.active = true
                        this.current = _tab
                        searchState.tabid = _tab.id

                        if (pushState && global.document) {
                            global.history.pushState(null, null, `?${qs.stringify(searchState)}`)
                        }
                    } else {
                        _tab.active = false
                    }
                }
            },
            tabFromLocation: function() {
                let searchState = qs.parse(location.search)
                this.changeTab(searchState.tabid, false)
            },
            removeTab: function(tab) {
                let index = this.tabs.indexOf(tab)
                this.tabs.splice(index, 1)
                this.$el.removeChild(tab.$el)
                tab.removeTab()
                if (this.tabs[0]) {
                    this.changeTab(this.tabs[0].id)
                }
            },
        },
        mounted: function() {
            if (global.document) {
                global.addEventListener('popstate', this.tabFromLocation)
            }


            // Set default active
            let searchState = qs.parse(location.search)
            if (!searchState.tabid) {
                // Set first tab active if no tabid is in the querystring.
                this.current = this.tabs[0]
                this.tabs[0].active = true
            }
        },
        beforeDestroy: function() {
            if (global.document) {
                global.removeEventListener('popstate', this.tabFromLocation)
            }
        },
    }
}
