import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);

import global_config from './global_config_store.js'

const store = new Vuex.Store({
  modules: {
    global_config,
  }
});

store.dispatch('check_is_mobile');
window.addEventListener('resize', () => {
    store.dispatch('check_is_mobile');
});
document.addEventListener('scatterLoaded', scatterExtension => {
    store.dispatch('check_scatter');
});
// 
export default store;