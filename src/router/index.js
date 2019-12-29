import Vue from 'vue'
import Router from 'vue-router'
import SignIn from '../views/signIn'
import Home from '../views/home'
import Blog from '../components/blog-list'
import Todo from '../components/todo'
import BlogEdit from '../components/blog-edit'
import Album from '../components/album'
Vue.use(Router)

export default new Router({
    mode:"history",
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            redirect:'/blog',
            children:[
                {
                    path:'/blog',
                    name:'blog',
                    component:Blog
                },
                {
                    path:'/todo',
                    name:'todo',
                    component: Todo
                },
                {
                    path:'/editBlog',
                    name:'editBlog',
                    component:BlogEdit
                },
                {
                    path:'/album',
                    name:'album',
                    component:Album
                }
            ]
        },
        {
            path:'/login',
            name:'SignIn',
            component:SignIn
        },
    ]
})
