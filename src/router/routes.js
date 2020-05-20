/* jshint esversion: 6 */
import {auth, guest, profileComplete} from './middleware.js';

export default [
    {
        path: '/admin',
        component: require('../components/views/About'),
        beforeEnter: auth
    },
    {
        path: '/signin',
        name: 'signin',
        beforeEnter: guest,
        component: require('../components/views/SignIn'),
        meta: {
            actionbar: {
                header: {
                    title: 'SignIn'
                }
            }
        }
    },
    {
        path: '/forgot-password',
        name: 'forget-password',
        beforeEnter: guest,
        component: require('../components/views/PasswordReset'),
        meta: {
            actionbar: {
                header: {
                    title: 'Forgot Password'
                }
            }
        }
    },
    {
        path: '/welcomeRegister',
        name: 'signUpSuccess',
        beforeEnter: guest,
        component: require('../components/views/WelcomeRegister'),
        meta: {
            actionbar: {
                header: {
                    title: 'Welcome Register'
                }
            }
        }
    },
    {
        path: '/signUp',
        name: 'signup',
        beforeEnter: guest,
        component: require('../components/views/SignUp'),
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    title: 'Edit Profile',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/login',
        name: 'login',
        beforeEnter: guest,
        component: require('../components/views/Login'),
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    },
                    buttons: ['clear']

                }
            },
            background: {
                style: 'blue'
            }
        }
    },
    {
        path: '/register',
        name: 'register',
        beforeEnter: guest,
        component: require('../components/views/Register'),
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    title: 'Edit Profile',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/activate/:token',
        name: 'activate',
        beforeEnter: guest,
        component: require('../components/views/Activate'),
        props: true
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        beforeEnter: guest,
        component: require('../components/views/ResetPassword'),
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    },
                    buttons: ['back']
                }
            },
            background: {
                style: 'blue'
            }
        }
    },
    {
        path: '/reset-password/:token',
        name: 'reset-password-confirm',
        beforeEnter: guest,
        component: require('../components/views/ResetPassword'),
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    },
                    buttons: ['back']
                }
            },
            background: {
                style: 'blue'
            }
        }
    },
    {
        path: '/profile/:id',
        name: 'profile',
        component: require('../components/views/Profile.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'Profile'
                }
            }
        }
    },
    {
        path: '/my-trips',
        name: 'my-trips',
        component: require('../components/views/MyTrips'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    title: 'My profile',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips',
        name: 'trips',
        component: require('../components/views/Trips'),
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'trips'
                }
            }
        }
    },
    {
        path: '/search',
        name: 'search',
        component: require('../components/views/search'),
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'search'
                },
                header: {
                    title: 'Search',
                    buttons: ['']
                }
            }
        }
    },
    {
        path: '/trips/create',
        name: 'new-trip',
        component: require('../components/views/NewTrip'),
        beforeEnter: (to, from, next) => {
            auth(to, from, next);
            profileComplete(to, from, next);
        },
        meta: {
            actionbar: {
                header: {
                    title: 'Creat Trip',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/tripInfo/:id',
        name: 'tripInfo',
        component: require('../components/views/TripInfo'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                header: {
                    title: 'Trip Edit/Delete'
                }
            }
        }
    },
    {
        path: '/trips/update/:id',
        name: 'update-trip',
        component: require('../components/views/NewTrip'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                header: {
                    title: 'New Trip',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/:id',
        name: 'detail_trip',
        component: require('../components/views/Trip'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'home'
                },
                header: {
                    title: 'Trip',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/:id/:location',
        name: 'detail_trip_location',
        component: require('../components/views/Trip'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'home'
                },
                header: {
                    title: 'Home',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: require('../components/views/Notifications.vue'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'notifications'
                },
                header: {
                    title: 'Notifications'
                }
            }
        }
    },
    {
        path: '/setting',
        name: 'settings',
        component: require('../components/views/Setting'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'Settings'
                }
            }
        },
        children: [
            {
                path: 'notifications',
                name: 'notification',
                component: require('../components/views/Notification'),
                meta: {
                    actionbar: {
                        header: {
                            title: 'Notifications'
                        }
                    }
                }
            },
            {
                path: 'security',
                name: 'security',
                component: require('../components/views/Security'),
                meta: {
                    actionbar: {
                        header: {
                            title: 'Security'
                        }
                    }
                }
            },
            {
                path: 'about',
                name: 'about',
                component: require('../components/views/About'),
                meta: {
                    actionbar: {
                        header: {
                            title: 'About'
                        }
                    }
                }
            }
        ]
    },
    {
        path: '/conversations',
        name: 'conversations-list',
        component: require('../components/views/ConversationList'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'conversations'
                },
                header: {
                    title: 'Messages'
                }
            },
            background: {
                style: 'white'
            }
        },
        children: [
            {
                path: ':id',
                name: 'conversation-chat',
                component: require('../components/views/ConversationChat'),
                props: true,
                meta: {
                    hide: true,
                    actionbar: {
                        footer: {
                            active_id: 'conversation'
                        },
                        header: {
                            title: 'Conversations',
                            buttons: ['back']
                        }
                    },
                    background: {
                        style: 'white'
                    }
                }
            }
        ]
    },
    {
        path: '/about',
        name: 'about',
        component: require('../components/views/About'),
        meta: {
            actionbar: {
                header: {
                    title: 'About',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/terms',
        name: 'terms',
        component: require('../components/views/TermsAndConditions'),
        meta: {
            actionbar: {
                header: {
                    title: 'terms',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/map',
        name: 'map',
        component: require('../components/views/Map.vue'),
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'map'
                }
            }
        }
    },
    {
        path: '/main',
        name: 'main',
        component: require('../components/views/Main.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'main'
                }
            }
        }
    },
    {
        path: '/offerride/setCarAndId',
        name: 'setCarAndId',
        component: require('../components/views/OfferRide.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'setCarAndId'
                }
            }
        }
    },
    {
        path: '/offerride/setRideSchedule',
        name: 'setRideSchedule',
        component: require('../components/views/SetRideSchedule.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'setRideSchedule'
                }
            }
        }
    },
    {
        path: '/offerride/postRide',
        name: 'postRide',
        component: require('../components/views/PostRide.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'postRide'
                }
            }
        }
    },
    {
        path: '/messages',
        name: 'messages',
        component: require('../components/views/Messages.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'Messages'
                }
            }
        }
    },
    {
        path: '/communities',
        name: 'communities',
        component: require('../components/views/Community.vue'),
        props: true,
        meta: {
            actionbar: {
                header: {
                    title: 'Communities'
                }
            }
        }
    },
    {
        path: '/yourTrips',
        name: 'your-trips',
        component: require('../components/views/YourTrips.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'YourTrips'
                }
            }
        }
    },
    {
        path: '/detail/:name',
        name: 'detail',
        component: require('../components/views/DriverDetail.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'DriverDetail'
                }
            }
        }
    },
    {
        path: '/googlemap',
        name: 'googleMap',
        component: require('../components/views/GoogleMap'),
        props: true
    },
    {
        path: '/searchResult',
        name: 'searchResult',
        component: require('../components/views/SearchResult.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'SearchResult'
                }
            }
        }
    },
    {
        path: '/profile/:id',
        name: 'profileDetail',
        component: require('../components/views/ProfileDetail.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'Profile'
                }
            }
        }
    },
    {
        path: '/profile/edit/:id',
        name: 'edit-profile',
        component: require('../components/views/ProfileEdit.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'Profile'
                }
            }
        }
    },
    {
        path: '/circle-time',
        name: 'circle-time',
        component: require('../components/views/CircleTime'),
        meta: {
            actionbar: {
                header: {
                    title: 'CircleTime'
                }
            }
        }
    },
    {
        path: '/wallet',
        name: 'wallet',
        component: require('../components/views/Wallet'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'Wallet'
                }
            }
        }
    },
    {
        path: '/*',
        redirect: '/signin'
    }
];
