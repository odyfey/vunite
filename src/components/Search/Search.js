import FontAwesomeIcon from "@fortawesome/vue-fontawesome"
import TopicList from "@/components/TopicList/"
import { config } from "@/config"

export default {
    name: "Search",
    data() {
        return {
            state: "init",
            raw: {},
            posts: []
        }
    },
    components: {
        "fa-icon": FontAwesomeIcon,
        TopicList
    },
    methods: {
        avatar(post) {
            return `${config.discourse.backend}/${post.avatar_template.replace(
                "{size}",
                36
            )}`
        },
        title(topicId) {
            var topic = this.raw.topics.find(item => item.id === topicId)
            if (!topic) return null
            return topic.fancy_title
        },
        goTopic(id) {
            this.$router.push({
                path: `/topic/${id}`
            })
        },
        async execSearch() {
            await this.$scrollTo("body", 300)
            this.raw = {}
            this.posts = []
            this.state = "init"
            var response = await this.$http.get(
                "/search?q=" + this.$route.query.q
            )
            this.raw = response.data
            this.posts = this.raw.posts
            this.state = "finished"
        }
    },
    watch: {
        $route(to, from) {
            this.execSearch()
        }
    },
    async mounted() {
        this.execSearch()
    }
}
