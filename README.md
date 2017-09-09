# fuet-tabs
A responsive tab component for Vue2. Checkout the [demo](https://wearespindle.github.io/fuet-tabs/).


# Usage
This module depends on npm and commonjs. Just install in your project with:
```bash
npm i fuet-tabs --save
```

Then include the two components with:

```javascript
const {Tabs, Tab} = require('fuet-tabs')
Vue.component('Tab', Tab)
Vue.component('Tabs', Tabs)
```

Then in the (form) template where you want tabs, use something like:

```javascript
<Tabs :tabs=tabs class="content-page">
    <template slot="tablist">
        <i class="fa fa-group"></i>
        <span v-once>{{phoneaccount.name}}</span>
    </template>

    <Tab slot="tabs" :data="tabs[0]"></Tab>

    <Tab slot="tabs" :data="tabs[1]"></Tab>

    <template slot="controls">
        <p class="control">
            <button class="button is-primary" :disabled="$v.$invalid" @click="upsertItem(item)">
                {{$t('Save changes')}}
            </button>
        </p>
        <p class="control">
            <router-link class="button"
                :to="$helpers.lastRoute('list_items', {item_id: $router.currentRoute.params.item_id})">
                {{$t('Cancel')}}
            </router-link>
        </p>
    </template>
</Tabs>
```

In the component, add the tabs data in the created hook like this:

```javascript
created: function() {
    this.tabs = [
        {id: 'preferences', title: $t('Preferences')},
        {id: 'advanced', title: $t('Advanced Settings')},
    ]
}
```

The reason to add the tabs data is because slots don't have a reference to it's
children in the lifecycle hooks that are supported by SSR. Don't forget to include the stylesheet from sass:

    // Assumes that you have node_modules in the sass includePaths.
    @import "fuet-tabs/src/scss/styles";

Please [file an issue](https://github.com/wearespindle/fuet-tabs/issues)
if you have feature requests or bug reports.
