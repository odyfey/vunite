<template>
  <div class="topic-list">
    <div class="spinner" v-if="state === 'init'">
      <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
    </div>
    <ul v-infinite-scroll="onLoadMore" infinite-scroll-distance="10">
      <li class="topic" v-for="item in topics" :key="item.id">
        <div class="topic-avatar">
          <img :src="avatar(item.posters[0].user_id)" />
        </div>
        <div class="topic-body" @click="onClickItem(item)">
          <h3>
            <fa-icon icon="thumbtack" v-if="item.pinned"></fa-icon>
            <span v-html="item.fancy_title"></span>
          </h3>
          <p>
            <fa-icon icon="reply"></fa-icon>
            <span class="topic-last-user">{{item.last_poster_username}}</span>
            <span class="topic-last-post">{{ $t('topic.replied') }} {{calendar(item.last_posted_at)}}</span>
          </p>
        </div>
        <div class="topic-controls">
          <router-link v-for="tag in item.tags" :key="tag.id"
            class="topic-tag" 
            :to="`/category/tag?id=${tag}`">{{tag}}</router-link>
          <ul class="topic-summary">
            <li>
              <fa-icon :icon="['far', 'comment']"></fa-icon>
              <span>{{number(item.posts_count - 1)}}</span>
            </li>
            <li>
              <fa-icon :icon="['fas', 'eye']"></fa-icon>
              <span>{{number(item.views)}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <div class="spinner" v-if="state === 'next'">
      <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
    </div>
  </div>
</template>

<script src="./TopicList.js"></script>
<style src="./TopicList.css" scoped></style>
