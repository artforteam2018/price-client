const state = {
    token: localStorage.getItem('user-token') || '',
    username: localStorage.getItem('username') || '',
    username2: '',
    status: '',
    ip: "192.168.0.123",
    axios: require('axios')
};

const mutations = {
    AUTH_REQUEST: (state) => {
        state.status = 'loading';
    },
    AUTH_SUCCESS: (state, data) => {
        state.status = 'success';
        state.token = data.token;
        state.username = data.username;
    },
    AUTH_ERROR: (state) => {
        state.status = 'error';
    },
    AUTH_LOGOUT: (state) => {
        state.token = null;
        state.username = null;
        localStorage.removeItem('user-token');
        localStorage.removeItem('username');
    },
    REGISTER_REQUEST: (state) => {
        state.status = 'loading';
    },
    SET_USERNAME2: (state, data) => {
        state.username2 = data.user;
    }

};

const actions = {
    AUTH_REQUEST: ({commit}, user) => {
        return new Promise((resolve, reject) => {
            commit('AUTH_REQUEST');
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/auth',
                data: user,
                method: 'POST'
            })
                .then(resp => {
                    const token = resp.data.token;
                    const username = resp.data.username;
                    localStorage.setItem('user-token', token); // store the token in localstorage
                    localStorage.setItem('username', username);
                    commit('AUTH_SUCCESS', {token: token, username: username});
                    resolve()
                })
                .catch(err => {
                    commit('AUTH_ERROR', err);
                    localStorage.removeItem('user-token');
                    localStorage.removeItem('username');
                    reject(err)
                })
        })
    },
    REGISTER_REQUEST: ({commit}, user) => {
        return new Promise((resolve, reject) => {
            // commit('REGISTER_REQUEST')
            this.default.state.axios({url: 'http://' + this.default.state.ip + ':3535/reg', data: user, method: 'POST'})
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    SESSION_CHECK: ({commit}) => {
        return new Promise(resolve => {
            if (this.default.state.token && this.default.state.username) {
                this.default.state.axios.defaults.headers.common['Token'] = this.default.state.token;
                this.default.state.axios.defaults.headers.common['Username'] = this.default.state.username;
            }
            this.default.state.axios({url: 'http://' + this.default.state.ip + ':3535/', method: 'GET'})
                .then(resp => {
                    if (!resp.data.success) {
                        if (resp.data.type === 426 || resp.data.type === 401) {
                            commit('AUTH_LOGOUT')
                        }
                    } else {
                        resolve();
                    }
                })
        })
    },
    AUTH_LOGOUT: ({commit}) => {
        return new Promise((resolve) => {
            commit('AUTH_LOGOUT');
            resolve()
        })
    },
    SET_USERNAME2: ({commit}, username2) => {
        return new Promise((resolve) => {
            commit('SET_USERNAME2', username2);
            resolve()
        })
    },
    GET_DIALOGS: () => {
        return new Promise((resolve, reject) => {
            if (this.default.state.token && this.default.state.username) {
                this.default.state.axios.defaults.headers.common['Token'] = this.default.state.token;
                this.default.state.axios.defaults.headers.common['Username'] = this.default.state.username;
            }
            // commit('REGISTER_REQUEST')
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getDialogs', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    SEARCH_USER: ({}, data) =>{
        return new Promise((resolve, reject) => {
            // commit('REGISTER_REQUEST')
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/searchUser', data: data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

};

const getters = {
    // count(state){
    //     return state.count
    // }
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    getUsername: state => state.username,
    getToken: state => state.token
};

export default {
    state,
    mutations,
    actions,
    getters
}
