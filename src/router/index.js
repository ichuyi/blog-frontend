import Vue from "vue";
import Router from "vue-router";
import SignIn from "../views/signIn";
import Home from "../views/home";
import Blog from "../components/blog-list";
import Todo from "../components/todo";
import BlogEdit from "../components/blog-edit";
import Album from "../components/album";
import BlogDetail from "../views/blogDetail";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: "首页",
      redirect: "/blog",
      children: [
        {
          path: "/blog",
          name: "blog",
          component: Blog,
          meta: "嵩豪酱--我的博客"
        },
        {
          path: "/todo",
          name: "todo",
          component: Todo,
          meta: "嵩豪酱--我的待办"
        },
        {
          path: "/editBlog",
          name: "editBlog",
          component: BlogEdit,
          meta: "嵩豪酱--新建/编辑"
        },
        {
          path: "/album",
          name: "album",
          component: Album,
          meta: "嵩豪酱--我的相册"
        }
      ]
    },
    {
      path: "/login",
      name: "SignIn",
      component: SignIn,
      meta: "嵩豪酱--欢迎登陆"
    },
    {
      path: "/blogDetail",
      name: "BlogDetail",
      component: BlogDetail,
      meta: "嵩豪酱--"
    }
  ]
});
