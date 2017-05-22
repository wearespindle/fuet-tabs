# vue-tabcordion
A responsive tab component for Vue2. Currently uses hardcoded styles from
[Bulma](http://bulma.io/).

# Usage
This module depends on npm and commonjs. Just install in your project with:

    npm i vue-tabcordion --save

Then include the two components with:

    const {Tabs, Tab} = require('vue-tabcordion')
    Vue.component('Tab', Tab)
    Vue.component('Tabs', Tabs)

Then in the template where you want tabs, use something like:

    <Tabs>
        <Tab id="preferences" :title="Preferences">
            <div>Content preferences</div>
        </Tab>
        <Tab id="help" :title="Help">
            <div>Content help</div>
        </Tab>
    </Tabs>

Don't forget to include the stylesheet from sass:

    // Assumes that you have node_modules in the sass includePaths.
    @import "vue-tabcordion/src/scss/styles";

That's it! Have fun with your new tabs. Please [file an issue](https://github.com/wearespindle/vue-tabcordion/issues)
if you have feature requests or bug reports.
