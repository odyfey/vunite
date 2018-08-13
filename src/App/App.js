import { config } from "@/config"
import { TOKEN_STORAGE, API_KEY_STORAGE, USERINFO_STORAGE } from "@/const"
import Sidebar from "@/components/Sidebar/"
import FontAwesomeIcon from "@fortawesome/vue-fontawesome"
import { mapGetters, mapMutations } from "vuex"

export default {
    name: "App",

    components: {
        Sidebar,
        "fa-icon": FontAwesomeIcon
    },

    data() {
        return {
            isShowMobMenu: false,
            scrolled: false,
            loginUrl: `${config.discourse.ssoProxy}/login`,
            query: null
        }
    },

    computed: {
        ...mapGetters({
            authorized: "User/authorized",
            username: "User/username",
            unreadNotifications: "Notification/unread"
        }),

        profileUrl() {
            return `${config.discourse.backend}/u/${this.username}/`
        }
    },

    methods: {
        ...mapMutations({
            setBearer: "User/setBearer",
            setApiKey: "User/setApiKey",
            setUserInfo: "User/setUserInfo",
            clear: "User/clear"
        }),

        fetchLocalStorage() {
            this.setBearer(localStorage.getItem(TOKEN_STORAGE))
            this.setApiKey(localStorage.getItem(API_KEY_STORAGE))
            this.setUserInfo(JSON.parse(localStorage.getItem(USERINFO_STORAGE)))
        },

        logout() {
            localStorage.removeItem(TOKEN_STORAGE)
            localStorage.removeItem(API_KEY_STORAGE)
            localStorage.removeItem(USERINFO_STORAGE)

            this.clear()
        },

        onscroll() {
            this.scrolled = window.scrollY > 0
        },

        search(event) {
            if (event.keyCode === 13) {
                this.$router.push({
                    path: `/search?q=${this.query}`
                })

                this.query = null
                this.$refs.searchInput.blur()
            }
        },

        toggleShowMobMenu() {
            this.isShowMobMenu = !this.isShowMobMenu
        }
    },

    mounted() {
        this.fetchLocalStorage()
        this.$store.dispatch("Notification/load")
    },

    beforeMount() {
        window.addEventListener("scroll", this.onscroll)
    },

    beforeDestroy() {
        window.removeEventListener("scroll", this.onscroll)
    }
}
