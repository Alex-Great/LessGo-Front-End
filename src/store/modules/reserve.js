import * as types from '../mutation-types';

// state
const state = {
    reserveFlag: false
};

// getters
const getters = {
    reserveFlag: state => state.reserveFlag
};

// actions

function reserveFlag (store, flag) {
    store.commit(types.RESERVE_FLAG, flag);
}

const actions = {
    reserveFlag
};

// mutations

const mutations = {
    [types.RESERVE_FLAG] (state, flag) {
        state.reserveFlag = flag;
    }
};
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
