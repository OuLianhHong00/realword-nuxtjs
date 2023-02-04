const cookieParser = process.server ? require('cookieparser') : undefined

export const state = () => {
    return {
        user: null
    }
}
export const mutations = {
    setUser(state, data) {
        state.user = data
    }
}

export const actions = {
    // nustServerInit 会在服务端调用期间自动调用
    nuxtServerInit ({ commit }, { req }) {
        let user = null;
        if (req.headers.cookie) {
            const parsed = cookieParser.parse(req.headers.cookie);
            try {
                user = JSON.parse(parsed.user)
            } catch (error) {
                
            }
        }
        commit('setUser', user)
    }
}