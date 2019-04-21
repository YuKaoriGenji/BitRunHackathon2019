import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import HelloVue from '@/components/day01/HelloVue'
import Login from '@/components/login/Login'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
    mode:'history',
    routes: [
    {
        path:'/',
        name:'App',
        component:Login,
        },
    {
        path:'/vue',
        name:'Home',
        component:Home
    },
    {
        path:'/helloword',
        name:'HelloWorld',
        component:HelloWorld
    }
  ]
})
