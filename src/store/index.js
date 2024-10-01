import { createStore } from 'vuex';

const store = createStore({
    state() {
        return {
            team: { // 当前查看的详情队伍
                id: 0,
                name: '',
                description: '',
                expireTime: new Date(),
                maxNum: 0,
                status: 0,
                createTime: new Date(),
                updateTime: new Date(),
                createUser: {},
                hasJoin: false,
                hasJoinNum: 0
            },
            user: { // 当前查看的详情用户
                id: 0,
                username: '',
                userAccount: '',
                avatarUrl: '',
                profile: '',
                gender: 0,
                phone: '',
                email: '',
                userStatus: 0,
                userRole: 0,
                tags: [],
                createTime: new Date()
            },
            loginUser: { // 当前登录用户
                id: 0,
                username: '',
                userAccount: '',
                avatarUrl: '',
                profile: '',
                gender: 0,
                phone: '',
                email: '',
                userStatus: 0,
                userRole: 0,
                tags: [],
                createTime: new Date()
            },
            chatUserId: { // 当前私聊用户id
                id: 0
            }
        };
    },
    mutations: {
        // 使用扩展运算符一次性更新 team 对象的所有属性
        updateTeam(state, teamData) { // 更新队伍数据
            state.team = { ...state.team, ...teamData };
        },
        updateUser(state, userData) { // 更新用户数据
            state.user = { ...state.user, ...userData };
        },
        updateLoginUser(state, userData) { // 更新当前登录用户数据
            state.loginUser = { ...state.loginUser, ...userData };
        },
        updateChatUserId(state, userData) { // 更新当前私聊用户id
            state.chatUserId = { ...state.chatUserId, ...userData };
        },
    }
});

export default store;