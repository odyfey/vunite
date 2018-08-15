import NoSSR from "vue-no-ssr"
import FontAwesomeIcon from "@fortawesome/vue-fontawesome"
import { mapState, mapGetters, mapActions } from "vuex"
import NewDiscussion from "../NewDiscussion/"

export default {
    name: "Sidebar",
    components: {
        "no-ssr": NoSSR,
        "fa-icon": FontAwesomeIcon,
        NewDiscussion
    },
    props: {
        showMobMenu: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            newDiscussionDialogVisible: false,
            newDiscussionDialogVisible2: false,
            postingNew: false,
            postingNew2: false
        }
    },
    computed: {
        ...mapState(["subCategories"]),

        ...mapGetters({
            apiKey: "User/apiKey",
            allCategories: "allCategories"
        })
    },
    methods: {
        ...mapActions([
            "getTags",
            "getCategories",
            "findCategoryBySlug",
            "checkSubCategories"
        ]),
        categoryName(item) {
            return item.slug ? item.slug : `${item.id}-category`
        },
        isActive(item) {
            let id
            if (item === "all") {
                id = "all"
            } else if (item === "activity") {
                id = "activity"
            } else if (item === "tags") {
                id = "tags"
            } else {
                id = this.categoryName(item)
            }

            if (
                this.$route.name === "CategoryDetail" &&
                this.$route.params.id === id
            ) {
                return true
            } else if (this.$route.name === "TagList" && id === "tags") {
                return true
            } else {
                return false
            }
        },
        isSubActive(item) {
            var id = this.categoryName(item)
            if (
                this.$route.name === "CategoryDetail" &&
                this.$route.params.subId === id
            ) {
                return true
            } else {
                return false
            }
        },

        postDiscussionValidate(data) {
            let result = true

            if (!data.topic) {
                this.$message({
                    type: "error",
                    message: this.$t("error.discussionTitleEmpty")
                })
                result = false
            } else if (!data.category || data.category.length === 0) {
                this.$message({
                    type: "error",
                    message: this.$t("error.categoryNotSelected")
                })
                result = false
            } else if (!data.contents) {
                this.$message({
                    type: "error",
                    message: this.$t("error.contentsEmpty")
                })
                result = false
            }

            return result
        },

        async postDiscussionRequest(data) {
            const form = new FormData()
            form.append("api_key", this.apiKey)
            form.append("raw", data.contents)
            form.append("title", data.topic)
            form.append("unlist_topic", false)
            form.append("category", data.category.slice(-1)[0])
            form.append("is_warning", false)
            form.append("archetype", "regular")
            form.append("typing_duration_msecs", 3800)
            form.append("tags", data.tags)
            form.append("nested_post", true)

            return await this.$http.post(`posts?api_key=${this.apiKey}`, form, {
                "content-type": `multipart/form-data; boundary=${
                    form._boundary
                }`
            })
        },

        async postNewDiscussion() {
            var { data } = this.$refs.newDiscussionForm

            if (this.postDiscussionValidate(data)) {
                this.postingNew = true
                const response = await this.postDiscussionRequest(data)
                this.postingNew = false

                if (response.data.success) {
                    this.newDiscussionDialogVisible = false
                    this.$router.push({
                        path: `/topic/${response.data.post.topic_id}`
                    })
                } else {
                    this.$message({
                        type: "error",
                        message: this.$t("error.serverIsBusy")
                    })
                    console.error("post occurs error", response)
                }
            }
        },
        async postNewDiscussion2() {
            var { data } = this.$refs.newDiscussionForm2

            if (this.postDiscussionValidate(data)) {
                this.postingNew2 = true
                const response = await this.postDiscussionRequest(data)
                this.postingNew2 = false

                if (response.data.success) {
                    this.newDiscussionDialogVisible2 = false
                    this.$router.push({
                        path: `/topic/${response.data.post.id}`
                    })
                } else {
                    this.$message({
                        type: "error",
                        message: this.$t("error.serverIsBusy")
                    })
                    console.error("post occurs error", response)
                }
            }
        },

        onNewDiscussionDialogOpen() {
            document.body.style.position = "fixed"
        },
        onNewDiscussionDialogClose() {
            document.body.style.position = "static"
        },
        closeMobMenu() {
            this.$emit("close-mob-menu")
        }
    },
    //todo: asyncData
    async mounted() {
        await Promise.all([this.getCategories(), this.getTags()])
        await this.checkSubCategories(this.$route.params.id)
    },
    watch: {
        async $route(to, from) {
            await this.checkSubCategories(to.params.id)
        }
    }
}
