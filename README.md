# vue-prerender-template

由 `Vue cli` 搭建，`prerender-spa-plugin` 进行预渲染，`vue-meta` 管理/自定义 `head` 信息 的简单项目模板。

## 项目结构

```
...
- prerender-routes
  - generator.js  // 自动根据 src/router/projects 下的路由文件生成预渲染的路由
                  // build 时会执行该文件，如不需要自动生成，移除相关逻辑即可
  - routes.js     // 自动生成的预渲染所需的路由
- src
  - router
    - projects    // 分项目路由，其下文件名称即项目一级路由
      - project-a.js
      - project-b.js
    - routes.js   // 运行时路由
    - index.js
  - views
    - project-a   // 项目1
    - project-b   // 项目2
    - Summary.vue // 项目路由汇总
- vue.config.js   // 预渲染等相关配置、逻辑
...
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev

npm run dev -- --project=projectName
```

### Compiles and minifies for production
```
// 打包所有项目，html 以路由文件名分目录输出到 dist
npm run build

// npm run build -- --project=project-a
// 仅打包指定项目，路由会自动移除最前面的 /project-a 直达项目内
npm run build -- --project=projectName
```

如果打包时报 `Chromium revision is not downloaded` 相关错误，请重新 `install @dreysolano/prerender-spa-plugin`，还是不行的话请删除 `node_modules/ package-lock.json` 使用 `yarn` 重试。

### 相关文档

- [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin)

- [vue-meta](https://github.com/nuxt/vue-meta)

- [预渲染 vs SSR](https://ssr.vuejs.org/zh/#%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%B8%B2%E6%9F%93-vs-%E9%A2%84%E6%B8%B2%E6%9F%93-ssr-vs-prerendering)