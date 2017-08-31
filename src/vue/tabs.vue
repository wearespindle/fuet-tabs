<div class="tabs-container">
    <div class="tablist tabs">
        <div class="tablist-title">
            <slot name="tablist"></slot>
        </div>
        <ul>
            <li
                v-for="tab in tabs" v-if="tab._show"
                v-bind:class="[{'is-active': currentId === tab.id},'item']"
                v-on:click="changeTab($event, tab)">
                <a :href="tab.uri">{{tab.title}}</a>
            </li>
        </ul>
    </div>
    <div class="content tabs-content">
        <slot name="tabs"></slot>
        <div class="field is-grouped tabs-controls">
            <slot name="controls"></slot>
        </div>
    </div>
</div>
