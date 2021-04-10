<template>
  <!-- 最外层这个div要保留，否则后续Vue的响应式不生效：mounted() { this.data = 'do change' }，看到这个id 原因你懂的 -->
  <div id="app">
    <router-view/>
  </div>
</template>
