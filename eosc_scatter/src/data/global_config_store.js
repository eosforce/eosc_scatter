export default {
    state: {
        is_mobile: false,
        has_scatter: false
    },
    mutations: {
        set_is_mobile (state, status = false) {
          state.is_mobile = status;
        },
        set_has_scatter (state, status = false) {
          state.has_scatter = status;
        }
    },
    actions: {
        check_is_mobile ({commit}) {

          if(document.body.offsetWidth < 800){
            commit('set_is_mobile', true);
          }else{
            commit('set_is_mobile', false);
          }

        },
        check_scatter ({commit}) {
          if(window.scatter) {
            commit('set_has_scatter', true);
          }else{
            commit('set_has_scatter', false);
          }
        }
    }
}