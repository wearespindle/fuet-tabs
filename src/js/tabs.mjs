import {tabs} from './templates'

export function Tabs(template) {
    return {
        /**
        * Remove the popstate event listener after
        * destroying the Tabs component.
        */
        beforeDestroy: function() {
            if (global.document) global.removeEventListener('popstate', this.popstateHandler)
        },
        /**
        * Set the active tab when the Tabs component is created and
        * register an event listener for back/forward navigation events.
        */
        created: function() {
            this.currentId = this.getCurrentTabId()
            this.setActiveTab(this.currentId)

            if (global.document) global.addEventListener('popstate', this.popstateHandler)
        },
        /**
        * The `currentId` is a reactive property that's being used
        * to set the active tab element.
        * @returns {Object} - Reactive properties for the Tabs component.
        */
        data: function() {
            return {
                currentId: null,
            }
        },
        methods: {
            /**
            * Handles click-events on the tab elements.
            * @param {Event} e - The original MouseClick event.
            * @param {Object} tab - The current tab that was passed along.
            */
            changeTab: function(e, tab) {
                if (e) e.preventDefault()
                if (global.document) global.history.pushState(null, null, tab.uri)

                this.currentId = tab.id
                this.setActiveTab(this.currentId)
            },
            /**
            * Figure out the currently active tab and return it's id. Return
            * the first tab's id when no tab is active.
            * @returns {String} - The active tab id.
            */
            getCurrentTabId: function() {
                let currentId
                const route = this.$router.currentRoute
                const routeLocation = this.$router.resolve({
                    name: this.$router.currentRoute.name,
                    params: this.$router.currentRoute.params,
                })

                if (route.query.tab) currentId = route.query.tab
                else currentId = this.tabs[0].id

                let match = false
                for (let tab of this.tabs) {
                    if (tab.id === currentId) match = true
                    tab.uri = `${routeLocation.href}?tab=${tab.id}`
                    tab.path = `${route.path}?tab=${tab.id}`
                }

                // The tab id must be present in the tabs data, otherwise
                // the first tab will be activated.
                if (!match) currentId = this.tabs[0].id
                return currentId
            },
            /**
            * Set the currently active tab after a navigation event, e.g.
            * back and forward events.
            * @param {Event} e - The original popstate event.
            */
            popstateHandler: function(e) {
                this.currentId = this.getCurrentTabId()
                this.setActiveTab(this.currentId)
            },
            /**
            * Set the currently active tab. It updates both the active
            * property of the tab data and where possible the tab's
            * instance active property. The tab instance may or may not
            * be available at the point that this function is used. Hides
            * or shows tabs that should be visible under certain conditions.
            * @param {String} tabId - Id of the tab to activate.
            */
            setActiveTab: function(tabId) {
                for (let tab of this.tabs) {
                    if (tab.id === tabId) {
                        tab.active = true
                        if (tab.instance) tab.instance.active = true
                    } else {
                        tab.active = false
                        if (tab.instance) tab.instance.active = false
                    }

                    if (!tab.hasOwnProperty('show')) {
                        tab._show = true
                    } else if (typeof tab.show === 'function') {
                        tab._show = tab.show()
                    }
                }
            },
        },
        props: [
            'tabs',
        ],
        render: tabs.r,
        staticRenderFns: tabs.s,
        watch: {
            $route: function() {
                this.currentId = this.getCurrentTabId()
                this.setActiveTab(this.currentId)
            },
        },
    }
}
