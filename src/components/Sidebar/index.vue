<template>
  <div class="sidebar-wrap">
    <!-- dialog for newDiscussion -->
    <el-dialog :title="$t('discussion.new')" 
      center
      class="new-discussion-dialog"
      width="50%"
      :visible.sync="newDiscussionDialogVisible"
      @open="onNewDiscussionDialogOpen"
      @close="onNewDiscussionDialogClose">
      <new-discussion ref="newDiscussionForm" />
      <div slot="footer">
        <el-button @click="newDiscussionDialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button type="primary" @click="postNewDiscussion" :disabled="postingNew">{{ $t('action.send') }}</el-button>
      </div>
    </el-dialog>
    <!-- dialog for mobile newDiscussion -->
    <el-dialog :title="$t('discussion.new')" 
      center
      class="new-discussion-dialog2"
      :visible.sync="newDiscussionDialogVisible2"
      :fullscreen="true"
      :modal="false"
      @open="onNewDiscussionDialogOpen"
      @close="onNewDiscussionDialogClose">
      <new-discussion ref="newDiscussionForm2" label-width="100px" inputMargin="0px" label-position="left" />
      <div slot="footer">
        <el-button @click="newDiscussionDialogVisible2 = false">{{ $t('action.cancel') }}</el-button>
        <el-button type="primary" @click="postNewDiscussion2" :disabled="postingNew2">{{ $t('action.send') }}</el-button>
      </div>
    </el-dialog>

    <nav id="sidebar" class="hidden-xs-only">

      <!-- the main sidebar items -->
      <no-ssr>
        <affix relative-element-selector="#app-main" :offset="{ top: 50, bottom: 30 }" style="width:190px">
          <ul>
            <li class="new-discussion">
              <el-button @click="newDiscussionDialogVisible = true">{{ $t('discussion.new') }}</el-button>
            </li>
            <li class="text-button all-discussion" :class="isActive('all') ? 'active' : ''">
              <router-link to="/category/all">
                <fa-icon :icon="['far', 'comments']" class="icon" />
                <span>{{ $t('route.categories') }}</span>
              </router-link>
            </li>
            <li class="text-button tags" :class="isActive('tags') ? 'active' : ''">
              <router-link to="/tags">
                <fa-icon icon="th-large" class="icon" />
                <span>{{ $t('route.tags') }}</span>
              </router-link>
            </li>
            <li class="text-button" :class="isActive('activity') ? 'active' : ''">
              <router-link to="/category/activity">
                <fa-icon icon="dove" class="icon" />
                <span>{{ $t('route.activity') }}</span>
              </router-link>
            </li>
            <li class="separator"></li>
            <li v-for="item in allCategories"
              :key="item.id"
              class="text-button" 
              :class="isActive(item) ? 'active': ''" 
            >
              <router-link :to="`/category/${categoryName(item)}`" :title="item.description">
                <i class="color-icon icon" :style="`background:#${item.color}`" />
                <span>{{item.name}}</span>
              </router-link>
              <ul class="sub-categories" v-if="isActive(item)">
                <li v-for="subItem in subCategories"
                  :key="subItem.id"
                  class="text-button"
                  :class="isSubActive(subItem) ? 'active' : ''"
                >
                  <router-link :to="`/category/${categoryName(item)}/${categoryName(subItem)}`">
                    <span>{{subItem.name}}</span>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </affix>
      </no-ssr>
    </nav>

    <div class="mob-sidebar-bg-cover" :class="{ dn: !showMobMenu }">
      <nav id="mob-sidebar">
        <!-- the main sidebar items -->
        <div>
          <ul>
            <li class="text-button all-discussion" @click="closeMobMenu">
              <router-link to="/">
                <fa-icon icon="home" class="icon" />
                <span>{{ $t('route.home') }}</span>
              </router-link>
            </li>
            <li class="text-button all-discussion" @click="closeMobMenu" :class="isActive('all') ? 'active' : ''">
              <router-link to="/category/all">
                <fa-icon :icon="['far', 'comments']" class="icon" />
                <span>{{ $t('route.categories') }}</span>
              </router-link>
            </li>
            <li class="text-button tags" @click="closeMobMenu" :class="isActive('tags') ? 'active' : ''">
              <router-link to="/tags">
                <fa-icon icon="th-large" class="icon" />
                <span>{{ $t('route.tags') }}</span>
              </router-link>
            </li>
            <li class="text-button" @click="closeMobMenu" :class="isActive('activity') ? 'active' : ''">
              <router-link to="/category/activity">
                <fa-icon icon="dove" class="icon" />
                <span>{{ $t('route.activity') }}</span>
              </router-link>
            </li>
            <li class="separator"></li>
            <li v-for="item in allCategories"
              :key="item.id"
              class="text-button" @click="closeMobMenu" 
              :class="isActive(item) ? 'active': ''" 
            >
              <router-link :to="`/category/${categoryName(item)}`" :title="item.description">
                <i class="color-icon icon" :style="`background:#${item.color}`" />
                <span>{{item.name}}</span>
              </router-link>
              <ul class="sub-categories" v-if="isActive(item)">
                <li v-for="subItem in subCategories"
                  :key="subItem.id"
                  class="text-button"
                  :class="isSubActive(subItem) ? 'active' : ''"
                >
                  <router-link :to="`/category/${categoryName(item)}/${categoryName(subItem)}`">
                    <span>{{subItem.name}}</span>
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="new-discussion">
              <el-button @click="newDiscussionDialogVisible2 = true">{{ $t('discussion.new') }}</el-button>
            </li>
          </ul>
        </div>
        
      </nav>
    </div> <!-- mob-sidebar-bg-cover end -->
  </div>
</template>

<script src="./Sidebar.js"></script>
<style src="./Sidebar.css" scoped></style>
