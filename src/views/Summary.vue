<template>
  <!-- 汇总/目录 -->
  <div style="width:300px;margin:50px auto;">
    <h1>项目目录：</h1>
    <ul style="font-size:17px;line-height:2">
      <li v-for="route in routes" :key="route.path">
        <span>{{ route.name }}：</span>
        <a :href="route.path" style="color:blue">{{ route.path }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import routes from '@/router/routes';

export default {
  metaInfo: {
    title: '预渲染项目'
  },
  data() {
    return {
      routes: routes.map(a => ({ path: a.path, name: a.path.substring(1) })).filter(a => Boolean(a.path))
    }
  }
}
</script>
