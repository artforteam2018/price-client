const state = {
    token: localStorage.getItem('user-token') || '',
    username: localStorage.getItem('username') || '',
    region: localStorage.getItem('region') || '',
    username2: '',
    status: '',
    ip: "192.168.255.28",
    //ip: "localhost",
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
        state.region = data.region;
    },
    AUTH_ERROR: (state) => {
        state.status = 'error';
    },
    AUTH_LOGOUT: (state) => {
        state.token = null;
        state.username = null;
        localStorage.removeItem('user-token');
        localStorage.removeItem('username');
        localStorage.removeItem('region');
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
                    const region = resp.data.region.join(',');
                    localStorage.setItem('user-token', token); // store the token in localstorage
                    localStorage.setItem('username', username);
                    localStorage.setItem('region', region);
                    commit('AUTH_SUCCESS', {token: token, username: username, region: region});
                    resolve()
                })
                .catch(err => {
                    commit('AUTH_ERROR', err);
                    localStorage.removeItem('user-token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('region');
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
    UPDATE_PRICES: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/updatePrices', method: 'GET'
            })
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
                this.default.state.axios.defaults.headers.common['Region'] = this.default.state.region;
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
    GET_RECEIVERS: ({}) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getReceivers', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    CHANGE_RECEIVERS: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/changeReceivers', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    GET_TEMPLATES: ({}) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getTemplates', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    GET_ADD: ({}) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getAdd', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    CHANGE_TEMPLATES: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/changeTemplates', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    GET_HEADERS: ({}) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getHeaders', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    GET_ONE_ROW: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getOneRow', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    CHANGE_HEADERS: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/changeHeaders', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    GET_TEMPLATE: ({}) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getTemplate', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    CHANGE_TEMPLATE: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/changeTemplate', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    GET_SENDERS: ({}) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getSenders', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    CHANGE_SENDERS: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/changeSenders', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    CHANGE_TABLE: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/changeTable', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    GET_SEND_LOG: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getSendLog', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    GET_UPDATE_LOG: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getUpdateLog', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    GET_SETTINGS: ({}) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getSettings', method: 'GET'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    GET_USER_SETTINGS: ({}, data) => {
        return new Promise(resolve => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getUserSettings', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
        })
    },
    CHANGE_SETTINGS: ({}, data) => {
        return new Promise((resolve, reject) => {
            this.default.state.axios({
                url: 'http://' + this.default.state.ip + ':3535/changeSettings', data, method: 'POST'
            })
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },

    CHANGE_USER_SETTINGS: ({}, data) => {
    return new Promise((resolve, reject) => {
        this.default.state.axios({
            url: 'http://' + this.default.state.ip + ':3535/changeUserSettings', data, method: 'POST'
        })
            .then(resp => {
                resolve(resp)
            })
            .catch(err => {
                reject(err)
            })
    })
},

};

const getters = {
    // count(state){
    //     return state.count
    // }
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    getUsername: state => state.username,
    getGmPwd: state =>  id => {
        return new Promise((resolve, reject) => {
            state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getGmPwd', method: 'GET'
            })
                .then(resp => {
                    resolve(resp.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getRegion: state => state.region,
    getToken: state  => state.token,
    getConvertRulesComp: state => id => {
        return new Promise((resolve, reject) => {
            state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getConvertRulesComp', method: 'GET'
            })
                .then(resp => {
                    resolve(resp.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getTemplatesComp: state => id => {
        return new Promise((resolve, reject) => {
            state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getTemplatesComp', method: 'GET'
            })
                .then(resp => {
                    resolve(resp.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getReceiversComp: state => id => {
        return new Promise((resolve, reject) => {
            state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getReceiversComp', method: 'GET'
            })
                .then(resp => {
                    resolve(resp.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getSendersComp: state => id => {
        return new Promise((resolve, reject) => {
            state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getSendersComp', method: 'GET'
            })
                .then(resp => {
                    resolve(resp.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getHeadersComp: state => id => {
        return new Promise((resolve, reject) => {
            state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getHeadersComp', method: 'GET'
            })
                .then(resp => {
                    resolve(resp.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    getAddComp: state => id => {
        return new Promise((resolve, reject) => {
            state.axios({
                url: 'http://' + this.default.state.ip + ':3535/getAddComp', method: 'GET'
            })
                .then(resp => {
                    resolve(resp.data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
};

export default {
    state,
    mutations,
    actions,
    getters
}
