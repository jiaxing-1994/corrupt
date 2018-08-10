import Vue from 'vue'
import Router from 'vue-router'
//登录
import login from '../components/pages/login'
//主体框架
import indexPage from '../components/index/index'
//主页
import homePage from '../components/pages/homePage'

//线索
  //举报线索
import reportCue from '../components/pages/cuesPage/reportCue'
  //互联网线索
import internetCue from '../components/pages/cuesPage/internetCue'
  //公益线索
import welfareCue from '../components/pages/cuesPage/welfareCue'
  //热点线索
import heartCue  from '../components/pages/cuesPage/heartCue'
  //自行發現綫索
import selfDiscovery from '../components/pages/cuesPage/selfDiscovery'
//关注线索
import followCue from '../components/pages/cuesPage/followCue'

//线索详情
import cueDetail from '../components/pages/cuesPage/cueDetail/cueDetail'

//知识库
import knowledge from  '../components/pages/knowledgePage/knowledgePage'
//知识详情页
import  knowledgeDetail from '../components/pages/knowledgePage/knowledgeDetail'

//新闻
import news from  '../components/pages/newsPage/newsPage'
//新闻详情
import newsDetail from '../components/pages/newsPage/newsDetail'

//数据分析
import newsAnalysis from  '../components/pages/dataAnalysis/newsAnalysis' //新闻热力分析
import cueFieldAnalysis from  '../components/pages/dataAnalysis/cueFieldAnalysis' //线索领域分析
import infoAnalysis from '../components/pages/dataAnalysis/infoAnalysis' //深圳信息分析
import searchResult from '../components/pages/dataAnalysis/searchResult' //深圳行政处罚
import search from '../components/pages/dataAnalysis/search' //深圳行政处罚
import searchBlank from '../components/pages/dataAnalysis/searchBlank' //空白页



//领导页面
import waitApproval from '../components/pages/leaderPage/waitApproval'//待审批线索
import allreadyApproval from '../components/pages/leaderPage/allreadyApproval'//已审批线索
import approvalResult from '../components/pages/leaderPage/approvalResult'//审批结果

//下级院页面
import waitReceive from '../components/pages/subordinatePage/waitReceive'//待接收线索
import waitFeedback from '../components/pages/subordinatePage/waitFeedback'//待反馈线索
import complete from '../components/pages/subordinatePage/complete'//完成

//无人机取证
import UAV from '../components/pages/UAV/UAV'

//检验报告
import inspectionReport from '../components/pages/inspectionReport/inspectionReport'
Vue.use(Router)

let router =  new Router({
 	routes:[
    {
      path:'/home',
      component: indexPage,
      name: '主页',
      children:[
        {
          path:'/',
          component:homePage,
          name: '主页',
          meta:{
            name:'主页'
          }
        },
        {
          path:'reportCue',
          name:reportCue,
          component:reportCue,
          meta:{
            keepAlive: true,
            name:'举报线索'
          }
        },
        {
          path:'internetCue',
          name:internetCue,
          component:internetCue,
          meta:{
            keepAlive: true,
            name:'互联网线索'
          }
        },
        {
          path:'welfareCue',
          name:welfareCue,
          component:welfareCue,
          meta:{
            keepAlive: true,
            name:'公益组织线索'
          }
        },
        {
          path:'heartCue',
          name:heartCue,
          component:heartCue,
          meta:{
            keepAlive: true,
            name:'热点线索'
          }
        },
        {
          path:'selfDiscovery',
          name:selfDiscovery,
          component:selfDiscovery,
          meta:{
            keepAlive: true,
            name:'自行发现线索'
          }
        },
        {
          path:'followCue',
          name:followCue,
          component:followCue,
          meta:{
            keepAlive: true,
            name:'关注线索'
          }
        },
        {
          path:'cueDetail',
          name:cueDetail,
          component:cueDetail,
          meta:{
            name:'线索详情'
          }
        },
        {
          path:'knowledge',
          name:knowledge,
          component:knowledge,
          meta:{
            keepAlive: true,
            name: '知识库',
          }
        },
        {
          path:'knowledgeDetail',
          name:knowledgeDetail,
          component:knowledgeDetail,
          meta:{
            name: '知识库详情',
          }
        },
        {
          path:'news',
          name:news,
          component:news,
          meta:{
            keepAlive: true,
            name: '新闻页',
          }
        },
        {
          path:'newsDetail',
          name:newsDetail,
          component:newsDetail,
          meta:{
            name: '新闻页详情',
          }
        },
        {
          path:'newsAnalysis',
          name:newsAnalysis,
          component:newsAnalysis,
          meta:{
            name: '新闻热力分析',
          }
        },
        {
          path:'cueFieldAnalysis',
          name:cueFieldAnalysis,
          component:cueFieldAnalysis,
          meta:{
            name: '线索领域分析',
          }
        },
        {
          path:'infoAnalysis',
          name:infoAnalysis,
          component:infoAnalysis,
          meta:{
            name: '信息分析',
          }
        },
        {
          path:'search',
          name:search,
          component:search,
          meta:{
            name: '全文搜索',
          }
        },
        {
          path:'searchResult',
          name:searchResult,
          component:searchResult,
          meta:{
            name: '全文搜索结果',
          }
        },
        {
          path:'searchBlank',
          name:searchBlank,
          component:searchBlank,
          meta:{
            name: '搜索空白页',
          }
        },
        {
          path:'waitApproval',
          name:waitApproval,
          component:waitApproval,
          meta:{
            name: '待审批',
          }
        },
        {
          path:'allreadyApproval',
          name:allreadyApproval,
          component:allreadyApproval,
          meta:{
            name: '已审批',
          }
        },
        {
          path:'approvalResult',
          name:approvalResult,
          component:approvalResult,
          meta:{
            name: '结果反馈',
          }
        },
        {
          path:'waitReceive',
          name:waitReceive,
          component:waitReceive,
          meta:{
            name: '待接收',
          }
        },
        {
          path:'waitFeedback',
          name:waitFeedback,
          component:waitFeedback,
          meta:{
            name: '待反馈',
          }
        },
        {
          path: 'complete',
          name: complete,
          component: complete,
          meta: {
            name: '已反馈',
          }
        },
        {
          path: 'UAV',
          name: UAV,
          component: UAV,
          meta: {
            name: '无人机取证',
          }
        },
        {
          path: 'inspectionReport',
          name: inspectionReport,
          component: inspectionReport,
          meta: {
            name: '检验报告',
          }
        },
      ]
    },
    {
      path:'/login',
      component:login,
      name: '登录',
    },
    {
      path:'/',
      component:login,
      redirect:'/login',
      name: '登录',
    },
 	]
});
router.beforeEach((to, from , next) => {
  let nextLeaderRoute = ['待审批', '已审批','审批结果']; //领导页面
  let nextSubordinateRoute = ['待反馈', '待接收', '已反馈']; //下级院页面
  let nextAdminRoute = ['关注线索','举报线索','互联网线索','公益组织线索','热点线索']; //管理员页面
  let IdentityType = localStorage.getItem('IdentityType'); //获取权限
  let allRoute = {nextAdminRoute:nextAdminRoute,nextLeaderRoute:nextLeaderRoute ,nextSubordinateRoute: nextSubordinateRoute,};
  let IdentityNum = -1;
  let routeName = to.meta.name;//线索详情
  if(to.path == "/home/cueDetail") {
    routeName = "线索详情";
  }
  for(let i in allRoute) {
    let item = allRoute[i];
    IdentityNum += 2;
    for(let j = 0; j < item.length; j++) {
      if(item[j].indexOf(routeName) > -1 && IdentityNum != IdentityType) {
        router.push({ name: '登录' });
      }
    }
  }
  next();
});
export default router
