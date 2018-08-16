import moment from "moment"
import pangu from "pangu"
import NoSSR from "vue-no-ssr"
import FontAwesomeIcon from "@fortawesome/vue-fontawesome"
import { mapGetters } from "vuex"
import EditDiscussion from "../EditDiscussion/"
import Editor from "../Editor/"
import { config } from "@/config"

export default {
    name: "Topic",
    components: {
        "no-ssr": NoSSR,
        "fa-icon": FontAwesomeIcon,
        EditDiscussion,
        editor: Editor
    },
    data() {
        return {
            baseUrl: config.baseUrl,
            title: null,
            posts: [],
            stream: [],
            avatarSize: 48,
            loading: true,
            loadingMore: false,
            rendered: false,
            rawTopic: {},
            contents: "",
            replyToPostId: null,
            titleEditable: false,
            editingPost: null,
            editPostDialogVisible: false
        }
    },
    computed: {
        cookedPosts() {
            return this.posts.map(post => {
                post.likes = 0
                post.isLiked = false
                post.actions_summary.forEach(action => {
                    if (action.id === 2) {
                        post.likes += action.count || 0
                        if (!post.isLiked && action.acted) {
                            post.isLiked = true
                        }
                    }
                })
                return post
            })
        },
        ...mapGetters({
            apiKey: "User/apiKey",
            username: "User/username"
        })
    },
    methods: {
        // 盘古开天辟地，把文字劈开。search pangu on github for more info
        spacing(text) {
            return pangu.spacing(text)
        },
        avatar(template_url, item) {
            return `${config.discourse.backend}/${template_url.replace(
                "{size}",
                this.avatarSize
            )}`
        },
        calendar(date) {
            return moment(date).fromNow()
        },
        editTitle() {
            if (!this.rawTopic.details.can_edit) return
            this.titleEditable = true
        },
        async saveTitle() {
            this.titleEditable = false
            var title = this.$refs.title.innerText
            if (!title) {
                this.$message({
                    type: "error",
                    message: this.$t("error.discussionTitleEmpty")
                })
                this.$refs.title.innerText = this.title
                return
            }
            if (title === this.title) {
                // just skip it if the title is not changed
                return
            }
            var { data } = await this.$http.put(
                `/t/topic/${this.rawTopic.id}`,
                { title }
            )
            this.title = title
            this.$message({
                type: "success",
                message: this.$t("success.discussionTitle")
            })
        },
        editPost(item) {
            this.editingPost = item
            this.editPostDialogVisible = true
            setTimeout(() => {
                this.$refs.editDiscussion.setPost(item)
            }, 100)
        },
        async savePost() {
            var discussion = this.$refs.editDiscussion
            if (!discussion.data.topic) {
                this.$message({
                    type: "error",
                    message: this.$t("error.discussionTitleEmpty")
                })
                return
            }
            if (!discussion.contents) {
                this.$message({
                    type: "error",
                    message: this.$t("error.contentsEmpty")
                })
                return
            }
            if (discussion.isEditTopic) {
                await this.$http.put(`/t/topic/${this.rawTopic.id}`, {
                    title: discussion.data.topic,
                    tags: discussion.data.tags
                })
            }

            const form = new FormData()
            form.append("api_key", this.apiKey)
            form.append("raw", discussion.contents)

            try {
                await this.$http.put(`/posts/${discussion.post.id}`, form, {
                    "content-type": `multipart/form-data; boundary=${
                        form._boundary
                    }`
                })

                this.editPostDialogVisible = false
                this.$message({
                    type: "success",
                    message: this.$t("success.edited")
                })
                this.reload()
            } catch (error) {
                if (
                    error.response &&
                    error.response.data &&
                    error.response.data.errors
                ) {
                    this.$alert(error.response.data.errors.join(""))
                } else {
                    this.$alert(this.$t("error.unknown"))
                }
            }
        },
        async toggleLike(post) {
            if (post.isLiked) {
                this.$message({
                    message: this.$t("warning.alreadyLiked")
                })
            } else {
                const form = new FormData()
                form.append("api_key", this.apiKey)
                form.append("id", post.id)
                form.append("post_action_type_id", 2) // for like, is 2

                await this.$http.post("post_actions", form, {
                    "content-type": `multipart/form-data; boundary=${
                        form._boundary
                    }`
                })

                post.isLiked = true
                post.likes += 1
                this.$forceUpdate()
            }
        },
        replyWith(item) {
            if (item) {
                this.contents = ""
                // bug-fix: 第一次点击回复后，把editor内容清空，再点击同一个人回复失效
                this.$nextTick(() => {
                    this.contents = `@${item.username} `
                    this.replyToPostId = item.id
                    this.$scrollTo("#reply", 800)
                    this.$refs.replyEditor.focus()
                })
            }
        },
        async sendReply() {
            var eidtor = this.$refs.replyEditor

            const data = {
                api_key: this.apiKey,
                raw: eidtor.value,
                unlist_topic: false,
                category: this.rawTopic.category_id,
                topic_id: this.rawTopic.id,
                is_warning: false,
                archetype: this.rawTopic.archetype,
                nested_post: false
            }

            if (this.replyToPostId) {
                data.reply_to_post_number = this.replyToPostId
                data.nested_post = true
            }

            const form = new FormData()
            for (const key in data) form.append(key, data[key])

            this.$http
                .request({
                    method: "post",
                    url: "/posts",
                    data: form,
                    headers: {
                        "content-type": `multipart/form-data; boundary=${
                            form._boundary
                        }`
                    }
                })
                .then(response => {
                    if (response.data.success) {
                        let resultPost = response.data.post

                        // hack: 发表回复后图片路径替换。discourse会自动替换，但posts不会
                        resultPost.cooked = resultPost.cooked.replace(
                            /<img src="(\S+)"/g,
                            '<img src="//discourse.test$1"'
                        )
                        // bug-fix: 原评论数没同步，导致无限加载
                        this.rawTopic.posts_count++
                        this.posts.push(resultPost)
                        this.contents = " "
                        // hack: 发表回复后清空编辑器
                        this.$nextTick(() => {
                            this.contents = ""
                        })
                        this.replyToPostId = null
                    }
                })
                .catch(error => {
                    if (
                        error.response &&
                        error.response.data &&
                        error.response.data.errors
                    ) {
                        this.$alert(error.response.data.errors.join(""))
                    } else {
                        this.$alert(this.$t("error.unknown"))
                    }
                })
        },
        postViewHandler(index, event) {
            if (this.rendered) {
                if (event.type === "enter") {
                    this.$router.replace({
                        path: `#${index}`
                    })
                    return
                }
            }
        },
        async reload() {
            this.$scrollTo("body", 300)
            this.loading = true

            var res = await this.$http.get(`/t/${this.$route.params.id}.json`)
            this.rawTopic = res.data
            this.title = res.data.title
            this.posts = res.data.post_stream.posts
            this.loading = false

            var postHash = {}
            var i = 0
            for (i = 0; i < this.posts.length; i++) {
                postHash[this.posts[i].id] = true
            }
            var stream = res.data.post_stream.stream
            var unique = []
            for (i = 0; i < stream.length; i++) {
                if (!postHash[stream[i]]) {
                    unique.push(stream[i])
                }
            }
            this.stream = unique
        },
        async onLoadMore() {
            if (this.loadingMore || this.loading) {
                return
            }
            if (this.rawTopic.posts_count === this.posts.length) {
                return
            }
            if (this.stream.length <= 0) {
                return
            }
            var nextPageStream = this.stream.splice(0, 20)

            this.loadingMore = true

            var res = await this.$http.get(
                `/t/${this.$route.params.id}/posts.json`,
                {
                    params: {
                        post_ids: nextPageStream
                    }
                }
            )
            var next = res.data.post_stream.posts

            this.posts = this.posts.concat(next)

            this.loadingMore = false
        },
        async toggleBookmark(post) {
            var val = !post.bookmarked
            post.bookmarked = val
            this.$forceUpdate()

            const data = new FormData()
            data.append("api_key", this.apiKey)
            data.append("bookmarked", post.bookmarked)
            await this.$http.put(`/posts/${post.id}/bookmark`, data, {
                "content-type": `multipart/form-data; boundary=${
                    data._boundary
                }`
            })
        }
    },
    async mounted() {
        await this.reload()

        setTimeout(() => {
            if (this.$route.hash) {
                this.$scrollTo(`#post${this.$route.hash.slice(1)}`, 300, {
                    offset: -52
                })
                setTimeout(() => (this.rendered = true), 300)
            } else {
                this.rendered = true
            }
            pangu.spacingElementByClassName("js-pangu-render")
        }, 300)
    }
}
