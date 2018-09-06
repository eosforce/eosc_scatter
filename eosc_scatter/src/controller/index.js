import vue from 'vue'
import vue_router from 'vue-router'
import Vuex from 'vuex'
vue.use(vue_router);

vue.use(Vuex);
import index_view from '../components/concat/index.vue'
import { check_lang_key } from '../data/lang.js'
let url_lang = check_lang_key();
const router_link = [
    {
        path: '/',
        redirect: '/' + url_lang,
        name: 'app',
        component: index_view,
        children: [
            {
                path: '/' + url_lang ,
                name: 'monitor_view',
                component: index_view
            }
        ]
    }
];

const router_config = new vue_router({
    routes: router_link
});

const app = new vue({
    router: router_config
}).$mount('#app');

