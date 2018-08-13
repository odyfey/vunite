import NoSSR from "vue-no-ssr"
import FontAwesomeIcon from "@fortawesome/vue-fontawesome"
import { mapGetters, mapActions } from "vuex"
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
            subCategories: [],
            newDiscussionDialogVisible: false,
            newDiscussionDialogVisible2: false,
            postingNew: false,
            postingNew2: false
        }
    },
    computed: {
        ...mapGetters(["allCategories"])
    },
    methods: {
        ...mapActions(["getTags", "getCategories", "findCategoryBySlug"]),
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
        async postNewDiscussion() {
            var { data } = this.$refs.newDiscussionForm

            if (!data.topic) {
                this.$message({
                    type: "error",
                    message: this.$t("error.discussionTitleEmpty")
                })
                return
            }
            if (!data.category || data.category.length === 0) {
                this.$message({
                    type: "error",
                    message: this.$t("error.categoryNotSelected")
                })
                return
            }
            if (!data.contents) {
                this.$message({
                    type: "error",
                    message: this.$t("error.contentsEmpty")
                })
                return
            }

            this.postingNew = true
            var response = await this.$http.post("/posts", {
                raw: data.contents,
                title: data.topic,
                unlist_topic: false,
                category: data.category.slice(-1)[0],
                is_warning: false,
                archetype: "regular",
                typing_duration_msecs: 3800,
                tags: data.tags,
                nested_post: true
            })
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
        },
        async postNewDiscussion2() {
            var { data } = this.$refs.newDiscussionForm2
            if (!data.topic) {
                this.$message({
                    type: "error",
                    message: this.$t("error.discussionTitleEmpty")
                })
                return
            }
            if (!data.category || data.category.length === 0) {
                this.$message({
                    type: "error",
                    message: this.$t("error.categoryNotSelected")
                })
                return
            }
            if (!data.contents) {
                this.$message({
                    type: "error",
                    message: this.$t("error.contentsEmpty")
                })
                return
            }

            this.postingNew2 = true
            var response = await this.$http.post("/posts", {
                raw: data.contents,
                title: data.topic,
                unlist_topic: false,
                category: data.category.slice(-1)[0],
                is_warning: false,
                archetype: "regular",
                typing_duration_msecs: 3800,
                tags: data.tags,
                nested_post: true
            })
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
        },
        async checkSubCategories(route = this.$route) {
            this.subCategories = []
            var curr = await this.findCategoryBySlug(route.params.id)
            if (!curr || !curr.has_children || !curr.id) {
                return
            }
            this.subCategories = await this.getCategories(curr.id)
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
    async mounted() {
        await Promise.all([this.getCategories(), this.getTags()])
        await this.checkSubCategories()
    },
    watch: {
        async $route(to, from) {
            await this.checkSubCategories(to)
        }
    }
}
