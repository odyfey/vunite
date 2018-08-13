<template>
  <div class="container">
    <div class="spinner" v-if="state === 'init'">
      <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
    </div>
    <ul>
      <li class="list-item" @click="goTopic(item.topic_id)" v-for="item in posts" :key="item.id">
        <div class="item-avatar">
          <img :src="avatar(item)" />
        </div>
        <div class="item-main">
          <h3 v-html="title(item.topic_id)"></h3>
          <p>{{item.blurb}}</p>
        </div>
      </li>
    </ul>
    <div v-if="state === 'finished' && !posts.length">
      <p>{{ $t('warning.notFound') }}</p>
    </div>
  </div>
</template>

<script src="./Search.js"></script>
<style src="./Search.css" scoped></style>
