import { mapGetters } from "vuex"

export default {
    name: "TagList",

    asyncData: ({ store }) => store.dispatch("getTags"),

    computed: {
        ...mapGetters(["allTags"]),

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
        }
    },

    methods: {
        randomColor() {
            const letters = "123456789"
            let color = "#"

            for (let i = 0; i < 2; i++) {
                let v = letters[Math.floor(Math.random() * letters.length)]
                color += v
            }

            return color + "a2d8"
        }
    }
}
