import vue from 'vue'
import vue_router from 'vue-router'
import Vuex from 'vuex'
vue.use(Vuex);
import index_view from '../components/concat/index.vue'
const app = new vue({
    components: {
        index_view
    }
}).$mount('#app');

