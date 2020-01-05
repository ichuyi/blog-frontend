import Vue from "vue";
import Router from "vue-router";
import SignIn from "../views/signIn";
import Home from "../views/home";
import Blog from "../components/blog-list";
import Todo from "../components/todo";
import BlogEdit from "../components/blog-edit";
import Album from "../components/album";
import BlogDetail from "../views/blogDetail";
import Music from "../components/music";
import Myyinfo from "../components/myinfo";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      name: "signIn",
      component: SignIn
    },
    {
      path: "/blogDetail",
      name: "blogDetail",
      component: BlogDetail
    },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: "首页",
      redirect: "/home/blog",
      children: [
        {
          path: "blog",
          name: "blog",
          component: Blog
        },
        {
          path: "todo",
          name: "todo",
          component: Todo
        },
        {
          path: "editBlog",
          name: "editBlog",
          component: BlogEdit
        },
        {
          path: "album",
          name: "album",
          component: Album
        },
        {
          path: "music",
          name: "music",
          component: Music
        },
        {
          path: "myinfo",
          name: "myinfo",
          component: Myyinfo
        }
      ]
    }
  ]
});
