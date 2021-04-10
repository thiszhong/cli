import RouterView from '@/components/RouterView.vue';

import projectARoutes from './projects/project-a';
import projectBRoutes from './projects/project-b';

// 一级 path 请以 / 开头
const allRoutes = [
  {
    path: "/project-a",
    component: RouterView,
    children: projectARoutes
  },
  {
    path: "/project-b",
    component: RouterView,
    children: projectBRoutes
  },
  {
    path: '',
    component: () => import("@/views/Summary.vue")
  }
];


// 分项目打包 npm run build/dev -- --project=projectName ，默认全部
// 自行确保 projectName 正确性（匹配一级 path）
const projectName = process.env.project;
let routes;
if (!projectName) routes = allRoutes;
else {
  const projectRoutes = allRoutes.filter(level => level.path.substring(1) === projectName);
  // 要加上 / 这一层，否则 PrerenderSpaPlugin 二级以上 routes 打包不会正常
  routes = [{
    path: "/",
    component: RouterView,
    children: !projectRoutes.length ? [] : projectRoutes[0].children
  }]
}
// console.log(333, projectName, routes)
export default routes;
