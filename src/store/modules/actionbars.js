import * as types from '../mutation-types';
import router from '../../router';
import globalStore from '../index';

const state = {
    title: 'Lessgo',
    subTitle: '',
    imgTitle: '',
    showMenu: true,
    header_buttons: [
        {
            id: 'back',
            icon: 'fa-angle-left',
            show: false,
            position: 'left'
        },
        {
            id: 'clear',
            icon: 'fa-times',
            show: false,
            position: 'right'
        },
        {
            id: 'share',
            icon: 'fa-share-alt',
            show: false,
            position: 'right'
        },
        {
            id: 'search',
            icon: 'fa-search',
            show: false,
            position: 'right'
        },
        {
            id: 'notifications',
            icon: 'fa-bell',
            show: false,
            position: 'right',
            url: 'notifications'

        }
    ],
    header_logo_visibility: true,
    footer_visibility: true,
    footer_buttons: [
        {
            id: 'search',
            icon: 'fa fa-search',
            url: 'search',
            label: 'Search',
            active: true
        },
        {
            id: 'trips',
            icon: 'fas fa-ticket-alt',
            label: 'Trips',
            url: 'trips',
            active: false
        },
        {
            id: 'new-trip',
            label: 'New Trip',
            icon: 'fa fa-plus',
            url: 'new-trip',
            active: false
        },
        {
            id: 'conversations',
            label: 'Inbox',
            icon: 'fa fa-inbox',
            url: 'conversations-list',
            active: false
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: 'fa fa-user',
            url: 'profile',
            active: false
        }
    ]
};

const getters = {
    title: state => state.title,
    subTitle: state => state.subTitle,
    imgTitle: state => state.imgTitle,
    showMenu: state => state.showMenu,
    leftHeaderButton: state => state.header_buttons.filter(item => item.position === 'left'),
    rightHeaderButton: state => state.header_buttons.filter(item => item.position === 'right'),
    headerLogoVisibility: state => state.header_logo_visibility,

    footerShow: state => state.footer_visibility,
    footerButtons: state => state.footer_buttons
};

const actions = {
    setTitle (store, title = 'Lessgo') {
        store.commit(types.HEADER_SET_TITLE, title);
        if (document) {
            document.title = title + (title !== 'Lessgo' ? ' - Lessgo' : '');
        }
    },

    setSubTitle (store, newSubTitle = '') {
        store.commit(types.HEADER_SET_SUB_TITLE, newSubTitle);
    },

    setImgTitle (store, newImgTitle = '') {
        store.commit(types.HEADER_SET_IMG_TITLE, newImgTitle);
    },

    setHeaderButtons (store, items) {
        store.commit(types.HEADER_SET_VISIBILITY, items);
    },

    showHeaderLogo (store, show = true) {
        store.commit(types.HEADER_LOGO_SET_VISIBILITY, show);
    },

    showFooter (store, show) {
        store.commit(types.FOOTER_SET_VISIBILITY, show);
    },

    setActiveFooter (store, id) {
        store.commit(types.FOOTER_SET_ACTIVE, id);
    },

    footerButtonClick (store, item) {
        let params = {};

        if (item.url === 'profile') {
            params.id = 'me';
        }

        if (item.url === 'search') {
            params.clearSearch = true;
            globalStore.dispatch('trips/tripsSearch', { is_passenger: false });
            globalStore.dispatch('trips/refreshList', true);
        }

        router.push({name: item.url, params});
    }

};

const mutations = {
    [types.HEADER_SET_TITLE] (state, title) {
        state.title = title;
    },

    [types.HEADER_SET_SUB_TITLE] (state, newSubTitle) {
        state.subTitle = newSubTitle;
    },
    [types.HEADER_SET_IMG_TITLE] (state, newImgTitle) {
        state.imgTitle = newImgTitle;
    },

    [types.FOOTER_SET_VISIBILITY] (state, show) {
        state.footer_visibility = show;
    },

    [types.HEADER_SET_VISIBILITY] (state, items) {
        state.header_buttons.forEach(item => {
            let index = items.findIndex(ids => ids === item.id);
            if (index < 0) {
                item.show = false;
            } else {
                item.show = true;
            }
        });
        if (items.includes('menu')) {
            state.showMenu = false;
        } else {
            state.showMenu = false;
        }
    },

    [types.HEADER_LOGO_SET_VISIBILITY] (state, show) {
        state.header_logo_visibility = show;
    },

    [types.FOOTER_SET_ACTIVE] (state, id) {
        state.footer_buttons.forEach(item => {
            if (item.id === id) {
                item.active = true;
            } else {
                item.active = false;
            }
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
