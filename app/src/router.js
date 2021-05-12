import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./views/Home.vue"),
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: () => import("./views/Schedule.vue"),
  },
  // {
  //   path: "/schedule2",
  //   name: "Schedule2",
  //   component: () => import("./views/Schedule2.vue"),
  // },
  {
    path: "/final_data",
    name: "Final Data",
    component: () => import("./views/FinalData.vue"),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/Login.vue')
  },
  {
    path: '/documents',
    name: 'Documents',
    component: () => import('./views/Documents.vue')
  },
  {
    path: '/obsolete',
    name: 'Obsolete Documents',
    component: () => import('./views/Obsolete.vue')
  },
  {
    path: '/edit_document',
    name: 'Edit Document',
    component: () => import('./views/EditDocument.vue'),
    props: true,
  },
  {
    path: "/document/:id",
    name: "Document",
    component: () => import("./views/Link.vue"),
 
    props: true,
  },
  
  {
    path: '/status_counter',
    name: 'Status Counter',
    component: () => import('./views/StatusCounter.vue')
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('./views/Notification.vue')
  },
  {
    path: '/tina',
    name: 'Tina',
    component: () => import('./views/Tina.vue')
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('./views/Editor_Tina.vue')
  },
  {
    path: '/incharge_assign/:id',
    name: 'Assign-In-Charge',
    component: () => import('./views/InCharge_Assign.vue')
  },
  {
    path: '/incharge_setting',
    name: 'Assign In-Charge Maintenance',
    component: () => import('./views/InCharge_Maintenance.vue')
  },
  {
    path: '/february_update',
    name: 'February Update',
    component:()=> import('./views/FebruaryUpdate.vue')
  },
  {
    path: '/remarks/:id',
    name: 'Remarks',
    component:()=> import('./views/Remarks.vue'),
  },
  {
    path: '/japan_memo',
    name: 'Japan Memo',
    component: () => import('./views/JapanMemo.vue'),
  },
  {
    path: "/initial_document/:id",
    name: "Initial Document",
    component: () => import("./views/OpenInitialDocument.vue"),
 
  },
  {
    path: "/department_incharge/",
    name: "Department Incharge",
    component: () => import("./views/Department_Incharge.vue"),
 
  },
  {
    path: "/UserManual/",
    name: "User Manual",
    component: () => import("./views/UserManual.vue"),
 
  },
  {
    path: "/maintenance/",
    name: "Rulebook Maintenance",
    component: () => import("./views/RulebookMaintenance.vue"),
 
  },
  {
    path: "/multikeywords/",
    name: "Multiple Keywords",
    component: () => import("./views/MultipleKeywords.vue"),
 
  },
  {
    path: "/rulebook_documents/",
    name: "Rulebook Documents",
    component: () => import("./views/RulebookDocuments.vue"),
 
  },
  
];



const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path !== "/login" && to.path != '/usermanual') {
    if (store.state.userInfo !== "a") {
      next();
    } else {
      next("login");
    }
  } else if (to.path === "/login" && store.state.userInfo != "a") {
    next(from.path);
  } else {
    next();
  }
});


export default router;
