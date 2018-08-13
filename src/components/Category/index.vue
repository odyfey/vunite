<template>
  <div class="container">
    <div class="controls">
      <el-select class="full-width" v-model="orderBy" size="small" @change="reload()">
        <el-option key="latest"
          :label="orderType.latest" value="latest"></el-option>
        <el-option key="top"
          :label="orderType.top" value="top"></el-option>
      </el-select>
    </div>
    <topic-list 
      ref="topicList"
      :topics="topics"
      :users="users"
      :fetch="fetch"
      :onClickItem="goTopic" />
  </div>
</template>

<script src="./Category.js"></script>
<style src="./Category.css" scoped></style>
