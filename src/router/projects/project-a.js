import Home from '../../views/project-a/Home.vue'

const routes = [
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "project-a" */ '../../views/project-a/About.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
];

export default routes;
