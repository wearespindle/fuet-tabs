<div>
    <div class="tabs">
        <ul>
            <li
                v-for="tab in tabs"
                v-bind:class="[{'is-active': current === tab},'item']"
                v-on:click="changeTab(tab.id, true)"
            >
                <a>{{tab.title}}</a>
            </li>
        </ul>
    </div>
    <div class="content tabs-content">
        <slot></slot>
    </div>
</div>
