<template>
  <div id="app">
    <header id="app-header" :class="scrolled ? 'layup' : ''">
      <div class="inner">
        <fa-icon icon="bars" @click="toggleShowMobMenu" class="mob-menu"></fa-icon>
        <router-link to="/" id="header-logo"></router-link>
        <ul id="header-index">
          <li><router-link to="/">{{ $t('route.home') }}</router-link></li>
        </ul>
        <el-row id="header-controls" type="flex" justify="end">
          <el-col :span="20" id="header-search-box">
            <fa-icon icon="search" />
            <input ref="searchInput" :placeholder="$t('app.search')" v-model="query" @keyup="search" />
          </el-col>
          <el-col :span="8" id="header-user-box">
            <router-link v-if="authorized" id="header-notification" class="hidden-xs-only" to="/notifications">
              <el-badge :is-dot="unreadNotifications.length > 0">
                <fa-icon icon="bell" />
              </el-badge>
            </router-link>
            <a id="header-login-btn" :href="loginUrl" v-if="!authorized">{{ $t('app.login') }}</a>
            <a id="header-login-btn" v-else :href="profileUrl">
              <fa-icon icon="user" />
            </a>
            <a id="header-login-btn" v-if="authorized" @click="logout"><fa-icon icon="sign-out-alt" /></a>
          </el-col>
        </el-row>
      </div>
    </header>
    <div id="app-contents">
      <div class="inner">
        <!-- listen click event -->
        <sidebar :show-mob-menu="isShowMobMenu" @close-mob-menu="toggleShowMobMenu"></sidebar>
        <div id="app-main">
          <router-view/>
        </div>
      </div>
    </div>
    <div id="app-footer">
      <div class="inner">
        <img src="https://developer.rokid.com/static/img/logo-developer-bottom.5c6d18f.png" />
        <ul>
          <li><a target="_blank" href="https://github.com/zullin/vunite">{{ $t('app.powered') }}</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script src="./App.js"></script>
<style src="./App.css"></style>
