// 定义一些路由
import Index from "../pages/Index.vue";
import Team from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import SearchPage from "../pages/SearchPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import UserRegisterPage from "../pages/UserRegisterPage.vue";
import TagsUpdatePage from "../pages/TagsUpdatePage.vue";
import UserShow from "../pages/UserShow.vue";
import TeamPage from "../pages/TeamPage.vue";
import ChatPage from "../pages/ChatPage.vue";
import UserChatPage from "../pages/UserChatPage.vue";
import UserFansPage from "../pages/UserFansPage.vue";
import UserFollowersPage from "../pages/UserFollowersPage.vue";


const routes = [
    { path: '/', component: Index },
    { path: '/team', title: '找队伍', component: TeamPage },
    { path: '/chat', title: '消息', component: ChatPage },
    {path: '/chat/private',title:'私聊', component: UserChatPage},
    { path: '/team/add', title: '创建队伍', component: TeamAddPage },
    { path: '/team/update', title: '更新队伍', component: TeamUpdatePage },
    { path: '/user', title: '个人信息', component: UserPage },
    {path: '/user/fans', title:'粉丝列表', component: UserFansPage},
    {path: '/user/followers', title:'关注列表', component: UserFollowersPage},
    { path: '/search', title: '找伙伴', component: SearchPage },
    { path: '/user/list', title: '用户列表', component: SearchResultPage },
    { path: '/user/edit', title: '编辑信息', component: UserEditPage },
    { path: '/user/login', title: '登录', component: UserLoginPage },
    { path: '/user/register', title: '注册', component: UserRegisterPage },
    { path: '/user/update', title: '更新信息', component: UserUpdatePage },
    { path: '/user/team/join', title: '我加入的队伍', component: UserTeamJoinPage },
    { path: '/user/team/create', title: '我创建的队伍', component: UserTeamCreatePage },
    { path: '/update/tags', title: '修改标签', component: TagsUpdatePage },
    { path: '/user/show', title: '用户信息', component: UserShow },
]

export default routes;
