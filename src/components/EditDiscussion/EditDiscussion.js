import { mapGetters, mapActions } from "vuex"
import Editor from "../Editor"

export default {
    name: "EditDiscussion",
    props: ["post", "topic"],
    components: {
        editor: Editor
    },

    data() {
        return {
            labelWidth: "140px",
            categories: [],
            tags: [],
            data: {
                topic: null,
                category: null,
                tags: [],
                contents: ""
            },
            isEditTopic: false
        }
    },

    computed: {
        ...mapGetters(["allTags", "allCategories"]),
        categoriesOption() {
            return this.createCategoriesOption(this.allCategories)
        },
        tagsOption() {
            return this.allTags.map(tag => tag.id)
        },
        contents() {
            return this.$refs.editor.value
        }
    },

    methods: {
        ...mapActions(["getTags", "getCategories"]),
        createCategoriesOption(list, ownChildren = true) {
            return list.map(item => {
                var option = {
                    label: item.name,
                    value: item.id
                }
                if (!item.has_children) return option

                option.children = ownChildren ? [] : undefined
                return option
            })
        },
        async loadSubCategories(val) {
            var parentId = val[val.length - 1]
            this.data.category = [parentId]

            var category = this.categories.find(item => item.value === parentId)
            if (category) {
                category.children = this.createCategoriesOption(
                    await this.getCategories(parentId),
                    false
                )
            }
        },
        async setPost(item) {
            this.isEditTopic = item.post_number === 1
            var { data } = await this.$http.get(`/posts/${item.id}`)
            this.data.contents = data.raw
        },
        pickEmoji(item) {
            console.log("pick pickEmoji", item)
            this.data.contents += item.native
        }
    },
    async mounted() {
        this.categories = this.categoriesOption
        this.tags = this.tagsOption

        // set data contents
        this.data.topic = this.topic.title
        this.data.category = this.topic.category
        this.data.tags = this.topic.tags
    }
}
