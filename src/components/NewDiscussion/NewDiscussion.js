import { mapGetters, mapActions } from "vuex"
import Editor from "../Editor/"

export default {
    props: {
        labelWidth: {
            type: String,
            default: "140px"
        },
        inputMargin: {
            type: String,
            default: "null"
        },
        labelPosition: {
            type: String,
            default: "right"
        }
    },
    name: "NewDiscussion",
    components: {
        editor: Editor
    },
    data() {
        return {
            categories: [],
            tags: [],
            data: {
                topic: null,
                category: null,
                tags: [],
                contents: ""
            }
        }
    },
    computed: {
        ...mapGetters(["allTags", "allCategories"]),
        categoriesOption() {
            return this.createCategoriesOption(this.allCategories)
        },
        tagsOption() {
            return this.allTags.map(tag => tag.id)
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
        updateContent(value, render) {
            this.data.contents = render
        }
    },
    async mounted() {
        this.categories = this.categoriesOption
        this.tags = this.tagsOption
    }
}
