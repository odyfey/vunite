<template>
  <div class="container">
    <ul>
      <li class="list-item"
        :class="item.read ? 'read' : ''"
        @click="redirect(item)" 
        v-for="item in allNotifications"
        :key="item.id">
        <div class="item-avatar">
          <fa-icon :icon="iconName(item.notification_type)" style="font-size:18px" />
        </div>
        <div class="item-main">
          <p v-if="item.notification_type === 1">
            <b>@{{item.data.display_username}}</b>
            {{ $t('notification.mentioned') }}
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
          </p>
          <p v-if="item.notification_type === 2">
            <b>{{item.data.display_username}}</b>
            {{ $t('notification.replied') }}
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
          </p>
          <p v-if="item.notification_type === 4">
            <b>{{item.data.display_username}}</b>
            {{ $t('notification.edited') }}
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
          </p>
          <p v-if="item.notification_type === 5">
            <b>{{item.data.display_username}}</b>
            {{ $t('notification.liked') }}
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
          </p>
          <p v-if="item.notification_type === 6">
            <b>{{item.data.display_username}}</b>
            {{ $t('notification.private_message') }}
            <a>{{item.fancy_title}}</a>
          </p>
          <p v-if="item.notification_type === 9">
            <b>{{item.data.display_username}}</b>
            {{ $t('notification.posted') }}
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
          </p>
          <p v-if="item.notification_type === 12">
            <b>{{item.data.username}}</b> {{ $t('notification.granted_badge') }} {{item.data.badge_name}}
          </p>
          <!-- for custom resolve plugin -->
          <p v-if="item.notification_type === 14 && item.data.message === 'solved.accepted_notification'">
            <b>{{item.data.display_username}}</b>
            {{ $t('notification.accepted') }}
            <router-link :to="`/topic/${item.topic_id}`">{{item.fancy_title}}</router-link>
          </p>
        </div>
        <div class="item-right">
          <span>{{formatDate(item.created_at)}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

export default {
    name: 'Notification',
    computed: {
        ...mapGetters({
            allNotifications: 'Notification/all'
        }),
    },

    components: {
        'fa-icon': FontAwesomeIcon,
    },

    methods: {
        iconName(type) {
            let result = []

            switch(type) {
                case 1:
                    result = ['fas', 'at']
                    break

                case 2:
                    result = 'reply'
                    break

                case 4:
                    result = ['far', 'edit']
                    break

                case 5:
                    result = ['far', 'heart']
                    break

                case 6:
                    result = ['far', 'envelope']
                    break

                case 9:
                    result = ['far', 'comment']
                    break

                case 12:
                    result = ['far', 'heart']
                    break

                case 14:
                    result = ['far', 'check-circle']
                    break
            }

            return result
        },

        formatDate(d) {
            return moment(d).fromNow()
        },
        
        redirect(item) {
            this.$router.push({
                path: `/topic/${item.topic_id}#${item.post_number - 1}`,
            })
        },
    },

    mounted() {
        this.$scrollTo('body', 300)
    },
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding: 30px;
}
.list-item {
  display: flex;
  cursor: pointer;
  padding: 12px;
  border-radius: 4px;
  transition: all .3s;
}
.list-item.read {
  opacity: 0.55;
}
.list-item:hover {
  background: rgb(231, 237, 243);
  opacity: 1;
}
.item-avatar {
  flex: 1;
}
.item-avatar img {
  height: 36px;
  width: 36px;
  border-radius: 18px;
}
.item-main {
  flex: 14;
}
.item-main h3 {
  color: #667d99;
  font-size: 16px;
  font-weight: bold;
}
.item-main p {
  color: #787878;
}
.item-right {
  flex: 3;
  text-align: right;
}
</style>
