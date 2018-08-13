import FontAwesomeIcon from "@fortawesome/vue-fontawesome"
import TopicList from "@/components/TopicList/"

export default {
    name: "Category",
    components: {
        "fa-icon": FontAwesomeIcon,
        TopicList
    },
    data() {
        return {
            nextUrl: null,
            topics: [],
            users: [],
            orderBy: "latest",
            orderType: {
                latest: this.$t("category.orderLatest"),
                top: this.$t("category.orderTop")
            }
        }
    },
    computed: {
        orderText() {
            return this.orderType[this.orderBy]
        }
    },
    methods: {
        async fetch() {
            if (!this.nextUrl) return

            let response = await this.$http.get(this.nextUrl)
            this.topics = this.topics
                .concat(response.data.topic_list.topics)
                .filter(topic => topic.visible)
            this.users = this.users.concat(response.data.users)
            this.nextUrl = response.data.topic_list.more_topics_url
        },
        async reload(slug, subSlug) {
            this.$scrollTo("body", 300)
            if (!slug) {
                slug = this.$route.params.id
                subSlug = this.$route.params.subId
            }

            this.topics.length = 0
            this.users.length = 0

            if (!slug || slug === "all") {
                this.nextUrl = `/${this.orderBy}.json`
            } else if (slug === "activity") {
                //todo: get activity stream or twitter stream
                this.nextUrl = `/${this.orderBy}.json?tags=活动`
            } else if (slug === "faq") {
                this.nextUrl = `/${this.orderBy}.json?tags=常见问题`
            } else if (slug === "tag") {
                this.nextUrl = `/${this.orderBy}.json?tags=${
                    this.$route.query.id
                }`
            } else {
                let slugs = [slug, subSlug].filter(item => !!item).join("/")
                this.nextUrl = `/c/${slugs}/l/${
                    this.orderBy
                }.json?no_subcategories=false`
            }
            await this.$refs.topicList.reload()
        },
        goTopic(item) {
            let path = `/topic/${item.id}`
            if (this.orderBy === "latest" && item.posts_count > 1) {
                path = `${path}#${item.posts_count - 1}`
            }
            this.$router.push({ path })
        }
    },
    watch: {
        $route(to, from) {
            var { id, subId } = to.params
            this.reload(id, subId)
        }
    },
    mounted() {
        var { id, subId } = this.$route.params
        this.reload(id, subId)
    }
}
