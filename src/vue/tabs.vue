<div>
    <div class="tabs">
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
        <slot></slot>
    </div>
</div>
