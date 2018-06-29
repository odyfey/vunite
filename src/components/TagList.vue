<template>
    <div class="container">
        <ul>
            <li class="tag-box" v-for="item in sortedTags" :key="item.id">
                <router-link :to="`/category/tag?id=${item.id}`" :style="`background:${randomColor()}`">
                    <span>{{item.text}}({{item.count}})</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'TagList',

    asyncData: ({ store }) => store.dispatch('getTags'),

    computed: {
        ...mapGetters(
            ['allTags']
        ),

        sortedTags() {
            return Object.assign([], this.allTags).sort((a, b) => {
                if (a.count < b.count) {
                    return 1
                } else if (a.count > b.count) {
                    return -1
                } else {
                    return 0
                }
            })
        },
    },

    methods: {
        randomColor() {
            const letters = '123456789'
            let color = '#'

            for (let i = 0; i < 2; i++) {
                let v = letters[Math.floor(Math.random() * letters.length)]
                color += v
            }

            return color + 'a2d8'
        },
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    width: 80%;
    margin: 10vh 15vh;
    text-align: center;
}

.tag-box {
    display: inline-block;
    margin: 8px;
}

.tag-box a {
    display: block;
    background: #fcfcfc;
    box-sizing: border-box;
    border-radius: 6px;
    width: 100%;
    height: 100%;
    color: #fff;
    text-align: center;
    padding: 10px;
    opacity: 0.9;
    transition: all .3s;
}

.tag-box a:hover {
    opacity: 1;
}
</style>
