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

<script src="./Notification.js"></script>
<style src="./Notification.css" scoped></style>
