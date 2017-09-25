import {tab} from './templates'

export function Tab() {
    return {
        created: function() {
            // Using slots, the parent Tabs component doesn't have a
            // reference to all Tab components yet. That's why the tabs data
            // doesn't include a reference to Tab instances yet.
            for (let tab of this.$parent.tabs) {
                if (tab.id === this.data.id) {
                    if (!tab.instance) tab.instance = this
                    if (tab.active) this.active = true
                }
            }
        },
        data: function() {
            return {
                active: false,
            }
        },
        props: [
            'data',
        ],
        render: tab.r,
        staticRenderFns: tab.s,
    }
}
