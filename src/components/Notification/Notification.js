import { mapGetters } from "vuex"
import moment from "moment"
import FontAwesomeIcon from "@fortawesome/vue-fontawesome"

export default {
    name: "Notification",
    computed: {
        ...mapGetters({
            allNotifications: "Notification/all"
        })
    },

    components: {
        "fa-icon": FontAwesomeIcon
    },

    methods: {
        iconName(type) {
            let result = []

            switch (type) {
                case 1:
                    result = ["fas", "at"]
                    break

                case 2:
                    result = "reply"
                    break

                case 4:
                    result = ["far", "edit"]
                    break

                case 5:
                    result = ["far", "heart"]
                    break

                case 6:
                    result = ["far", "envelope"]
                    break

                case 9:
                    result = ["far", "comment"]
                    break

                case 12:
                    result = ["far", "heart"]
                    break

                case 14:
                    result = ["far", "check-circle"]
                    break
            }

            return result
        },

        formatDate(d) {
            return moment(d).fromNow()
        },

        redirect(item) {
            this.$router.push({
                path: `/topic/${item.topic_id}#${item.post_number - 1}`
            })
        }
    },

    mounted() {
        this.$scrollTo("body", 300)
    }
}
