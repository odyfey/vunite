import moment from "moment"
import FontAwesomeIcon from "@fortawesome/vue-fontawesome"
import { config } from "@/config"

export default {
    name: "TopicList",

    components: {
        "fa-icon": FontAwesomeIcon
    },

    props: ["topics", "users", "fetch", "onClickItem"],

    data() {
        return {
            state: "init",
            loadable: false
        }
    },

    methods: {
        avatar(id) {
            var user = this.users.find(user => user.id === id)

            if (user)
                return `${
                    config.discourse.backend
                }/${user.avatar_template.replace("{size}", 36)}`
            else return null
        },

        calendar(date) {
            return moment(date).fromNow()
        },

        number(val) {
            if (val > 1000) {
                return `${parseInt(val / 1000)}k`
            } else {
                return val
            }
        },

        async onLoadMore() {
            if (!this.loadable) return

            this.loadable = false
            this.state = "next"
            await this.$props.fetch()
            this.state = "finished"
            this.loadable = true
        },

        async reload() {
            this.state = "init"
            await this.$props.fetch()
            this.state = "finished"
            this.loadable = true
        }
    }
}
