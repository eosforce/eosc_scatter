<template>
    <div>
        
        <div class="main_content">
            
            <div class="info_box" v-if="has_scatter">
                <available_view></available_view>
            </div>

            <div class="layout_max">
                <web_wallet></web_wallet>
            </div>

        </div>
    </div>
</template>
<script>
import web_wallet from '../web_wallet/web_wallet.vue'
import store from '../../data/store.js'
export default {
    data () {
        return {}
    },
    components: {
        web_wallet,
        available_view:  resolve => require(['../web_wallet/available.vue'], resolve),
    },
    computed: {
        has_scatter () {
            return store.state.global_config.has_scatter;  
        },
    },
    methods: {
    }
}
</script>