<template>
  <div>
    <mavon-editor
      ref="editor"
      @change="change"
      :value="initialValue"
      language="en"
      :subfield="false" 
      :placeholder="$t('editor.enterMessage')"
      :toolbars="editorToolbar"
      @imgAdd="addImage"
    />
    <!-- extend toolbar -->
    <el-popover
      v-if="!isMobile()"
      v-model="emojiVisible"
      placement="right"
      trigger="hover"
      @after-enter="renderEmoji">
      <div>
        <p v-if="rendering">{{ $t('emoji.rendering') }}</p>
          <no-ssr>
            <emoji-picker
              v-if="true"
              @select="pickEmoji"
              :set="emojiConf.set"
              :perLine="13"
              :sheetSize="emojiConf.sheetSize"
              :emojiSize="emojiConf.emojiSize"
              :native="false"
              :showPreview="false"
              :showSearch="false"
              :showSkinTones="false"
              :showCategories="false"
              :i18n="emojiTranslated" />
          </no-ssr>
      </div>
      <button slot="reference" ref="emoji" type="button" class="op-icon" :title="$t('emoji.title')">
        <fa-icon icon="smile"></fa-icon>
      </button>
    </el-popover>
    <el-upload v-on:submit.prevent
      class="upload-attach"
      name="filessss"
      :data="uploadPara"
      :show-file-list="false"
      :http-request="handleUploadFile"
      :on-success="onUploadFileSuccess"
      :on-error="onUploadFileError"
      action="/uploads.json">
      <span slot="trigger" style="display: none" ref="upload"></span>
      <button @click="triggerupload" ref="uploadFile" type="button" class="op-icon proxy-upload-trigger" :title="$t('editor.uploadFile')">
        <fa-icon icon="cloud-upload-alt"></fa-icon>
      </button>
    </el-upload>
  </div>
</template>

<script src="./Editor.js"></script>
