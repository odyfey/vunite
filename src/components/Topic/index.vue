<template>
  <div class="container">
    <el-dialog width="50%"
      :title="`${$t('topic.edit')}：${title}`"
      :visible.sync="editPostDialogVisible">
      <edit-discussion 
        ref="editDiscussion"
        :topic="rawTopic"
        :post="editingPost" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPostDialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button type="primary" @click="savePost">{{ $t('action.save') }}</el-button>
      </span>
    </el-dialog>

    <div class="topic-main">
      <div class="spinner" v-if="loading">
        <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
      </div>
      <h1 ref="title"
        :contenteditable="titleEditable"
        @dblclick="editTitle"
        @blur="saveTitle">
        {{title}}
      </h1>
      <ul v-infinite-scroll="onLoadMore" infinite-scroll-distance="10">
        <li class="post"
          :id="`post${index}`"
          v-for="(item, index) in cookedPosts">
          <div class="avatar">
            <img :src="avatar(item.avatar_template, item)"
              :height="avatarSize" 
              :width="avatarSize" />
          </div>
          <div class="contents">
            <div class="post-header">
              <span class="username">{{item.display_username}}</span>
              <span class="datetime">{{calendar(item.created_at)}}</span>
              <span class="floor">#{{index + 1}}</span>
            </div>
            <div class="post-body js-pangu-render" v-html="item.cooked"></div>
            <div class="post-summary">
              <a class="likes"
                :class="item.isLiked ? 'liked' : ''"
                @click="toggleLike(item)">
                <fa-icon :icon="['far', 'thumbs-up']"></fa-icon>
                <span>{{item.likes}}</span>
              </a>
              <a class="replies" :title="$t('action.reply')" @click="replyWith(item)">
                <fa-icon icon="reply"></fa-icon>
                <span>{{item.reply_count}}</span>
              </a>
              <div class="post-summary-right-controls">
                <a :title="$t('action.editPost')" v-if="item.can_edit" @click="editPost(item)">
                  <fa-icon icon="pencil-alt"></fa-icon>
                  <span>{{ $t('action.editPost') }}</span>
                </a>
                <a :title="$t('action.toBookmarks')" class="bookmark"
                  :class="item.bookmarked ? 'bookmarked' : ''"
                  @click="toggleBookmark(item)">
                  <fa-icon :icon="['far', 'bookmark']"></fa-icon>
                  <span>{{ $t('action.toBookmarks') }}</span>
                </a>
                <el-popover
                  :ref="`share-popover${index}`"
                  placement="bottom-end"
                  width="300"
                  trigger="click">
                  <span slot="reference">
                    <a class="share" :title="$t('action.share')">
                      <fa-icon icon="link"></fa-icon>
                      <span>{{ $t('action.share') }}</span>
                    </a>
                  </span>
                  <template>
                    <el-input size="small" autofocus
                      :value="`${baseUrl}/topic/${item.id}?u=${username}#${index + 1}`" />
                    <el-button type="primary" size="small" class="share-popover-copybtn">{{ $t('action.copyLink') }}</el-button>
                  </template>
                </el-popover>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="spinner" v-if="loadingMore">
        <fa-icon icon="spinner" class="fa-spin" size="2x"></fa-icon>
      </div>
      <div id="reply" class="reply-box">
        <div class="reply-header">
          <fa-icon icon="reply"></fa-icon>
          <span>{{title}}</span>
        </div>
        <editor
          ref="replyEditor"
          :initialValue="contents" />
        <div class="reply-footer">
          <el-button type="primary" size="small" @click="sendReply()">
            <fa-icon icon="reply" /> {{ $t('action.reply') }}
          </el-button>
          <el-button size="small">{{ $t('action.cancel') }}</el-button>
        </div>
      </div>
    </div>
    <!-- <div class="topic-controls hidden-sm-and-down">
      <affix relative-element-selector="#app-main" :offset="{ top: 40, bottom: 30 }" style="width:170px">
        <el-button type="primary" @click="replyWith()">回复</el-button>
        <el-button>邀请参与</el-button>
      </affix>
    </div> -->
  </div>
</template>

<script src="./Topic.js"></script>
<style src="./Topic.css" scoped></style>
