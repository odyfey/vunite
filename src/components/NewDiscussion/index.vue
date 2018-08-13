<template>
  <el-form size="small" :label-position="labelPosition">
    <el-form-item :label="$t('discussion.name')" :label-width="labelWidth">
      <el-input class="input-body" :placeholder="$t('discussion.namePlaceholder')"
        v-model="data.topic"
        :rules="[
          { required: true, message: $t('error.discussionTitleEmpty'), }
        ]"></el-input>
    </el-form-item>
    <el-form-item :label="$t('discussion.category')" :label-width="labelWidth">
      <el-cascader
        class="input-body"
        :options="categories"
        @active-item-change="loadSubCategories"
        v-model="data.category">
      </el-cascader>
    </el-form-item>
    <el-form-item :label="$t('discussion.tag')" :label-width="labelWidth">
      <el-select
        class="input-body"
        multiple
        filterable
        v-model="data.tags"
        :placeholder="$t('discussion.tagPlaceholder')">
        <el-option
          v-for="tag in tags"
          :key="tag" :label="tag" :value="tag">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label-width="inputMargin === 'null' ? labelWidth:inputMargin">
      <editor initialValue="" @change="updateContent" />
    </el-form-item>
  </el-form>
</template>

<script src="./NewDiscussion.js"></script>

<style scoped>
.input-body {
    width: 100%;
}
</style>