<template>
    <div class="container">
        <ul>
            <li class="tag-box" v-for="item in sortedTags" :key="item.id">
                <router-link :to="`/category/tag?id=${item.id}`" :style="`background:${randomColor()}`">
                    <span>{{item.text}}({{item.count}})</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script src="./TagList.js"></script>
<style src="./TagList.css" scoped></style>
