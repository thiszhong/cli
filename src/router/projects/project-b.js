import RouterView from '@/components/RouterView.vue';

const routes = [
  {
    path: 'next',
    name: 'ProjectBNext',
    component: RouterView,
    children: [
      {
        path: 'hello',
        name: 'qqqq',
        component: () => import(/* webpackChunkName: "project-b" */ "@/views/project-b/next/HelloNextWorld.vue")
      },
      {
        path: 'hi',
        name: 'wwww',
        component: () => import(/* webpackChunkName: "project-b" */ "@/views/project-b/next/HelloAgain.vue")
      },
      {
        path: 'next',
        name: 'eeee',
        component: RouterView,
        children: [
          {
            path: 'hi',
            name: 'rrrr',
            component: () => import(/* webpackChunkName: "project-b" */ "@/views/project-b/next/HelloAgain.vue")
          },
        ]
      },
    ]
  },
  {
    path: '',
    name: 'ProjectB',
    component: () => import(/* webpackChunkName: "project-b" */ "@/views/project-b/index.vue"),
  }
];

export default routes;
