import Vue from "vue"
import VueRouter from "vue-router"
import Main from "../site/Main"
import Home from "../views/Home"
import Welcome from "../views/Welcome"
import Choose from "../views/Choose"
import Protocol from "../views/Protocol"
import Pwd from "../views/Pwd"
import Create from "../views/Create"
import MnemonicConfirm from "../views/MnemonicConfirm"
import Import from "../views/Import"
import Login from "../views/Login"
import AccountDetail from "../views/AccountDetail"
import CoinAdd from "../views/CoinAdd"
import Setting from "../views/setting/Setting"
import SettingCommon from '../views/setting/Common'
import SettingNet from "../views/setting/Net"
import SettingSafe from "../views/setting/Safe"
import AccountAdd from "../views/AccountAdd"
import AccountImport from "../views/AccountImport"
import Search from "../views/Search"
import Send from "../views/Send"
import SendConfirm from "../views/SendConfirm"
import AccountSelect from "../views/AccountSelect"
import ConnectConfirm from "../views/ConnectConfirm"
import Enable from "../views/Enable"

Vue.use(VueRouter)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/",
    component: Main,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: Home,
      },
      {
        path: "/account/detail",
        name: "AccountDetail",
        component: AccountDetail,
      },
      {
        path: "/coin/add",
        name: "CoinAdd",
        component: CoinAdd,
      },
      {
        path: "/setting",
        name: "Setting",
        component: Setting,
      },
      {
        path: "/setting/common",
        name: "SettingCommon",
        component: SettingCommon,
      },
      {
        path: "/setting/net",
        name: "SettingNet",
        component: SettingNet,
      },
      {
        path: "/setting/safe",
        name: "SettingSafe",
        component: SettingSafe,
      },
      {
        path: "/account/add",
        name: "AccountAdd",
        component: AccountAdd,
      },
      {
        path: "/account/import",
        name: "AccountImport",
        component: AccountImport,
      },
      {
        path: "/search",
        name: "Search",
        component: Search,
      },
      {
        path: "/send",
        name: "Send",
        component: Send,
      },
      {
        path: "/send/confirm",
        name: "SendConfirm",
        component: SendConfirm,
      },

      {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/setting/About"),
      },
    ],
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/choose",
    name: "Choose",
    component: Choose,
  },
  {
    path: "/protocol",
    name: "Protocol",
    component: Protocol,
  },
  {
    path: "/pwd",
    name: "Pwd",
    component: Pwd,
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
  },
  {
    path: "/mnemonicConfirm",
    name: "MnemonicConfirm",
    component: MnemonicConfirm,
  },
  {
    path: "/import",
    name: "Import",
    component: Import,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/account/select",
    name: "AccountSelect",
    component: AccountSelect,
  },
  {
    path: "/connect/confirm",
    name: "ConnectConfirm",
    component: ConnectConfirm,
  },
  {
    path: "/enable",
    name: "Enable",
    component: Enable,
  },
]

const router = new VueRouter({
  routes
})

export default router
