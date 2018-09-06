<style type="text/css">
.ft_32{
    font-size: 32px;
}
.transfer_action{
    margin-left: 10px;
    cursor: pointer;
}
.available_title{
    margin-right: 10px;
}
.error_info{
    color: #ef0909cf;
    margin-top: 10px;
    background: #f3f3f3;
    padding: 10px;
}
</style>
<template>
    <div v-if="account_name">
        <template v-if="has_scatter && available.is_error">
            <div>
                <a href="javascript:;" @click="call_scatter" class="blue_ft">{{ lang.call_scatter }}</a>
                <div v-if="scatter_error_info" class="error_info">
                    {{ scatter_error_info }}
                </div>
            </div>
        </template>
        <template v-if="has_scatter && !available.is_error">
            <div>
                <span class="available_title">{{ lang.account }}:</span> <span class="">{{ account_name }}</span>
            </div>
            <br/>
            <div>
                <span class="available_title">{{ lang.available }}:</span> <span class=" ft_32">{{ amount }}</span><span class="blue_ft transfer_action"  @click="start_action('transfer')">{{ lang.transfer }}</span>
            </div>
            <box v-if="box_action_data"  v-bind:params="box_action_data" v-on:hide="clear_action" v-on:confirm="confirm"></box>
        </template>
    </div>
</template>
<script>
import { 
    toAsset,
} from '../utils/utils.js'
import {
    create_transfer_form
} from './action_form.js'
import {
    get_available,
    transfer,
    get_scatter_identity
} from '../../service/web_wallet_service.js'
import { lang } from '../../data/lang.js'
import store from '../../data/store.js'
export default {
    data () {
        return {
            available: '',
            lang: lang.data,
            box_action_data: null,
            is_on_load: false,
            page_index: 0,
            scatter_error_info: ''
        }
    },
    mounted() {
        this.init();
        if(this.has_scatter){
            this.get_available(true);
        }
    },
    destroyed() {
        this.reset();
    },
    components: {
        box: resolve => require(['../box/index.vue'], resolve)
    },
    computed: {
        account_name () {
            if(!this.available || !this.available.data) return '';
            return this.available.data.rows[0].name;
        },
        amount () {
            if(!this.available || !this.available.data) return '...';
            return this.available.data.rows[0].available;
        },
        has_scatter () {
            return store.state.global_config.has_scatter;
        }
    },
    watch: {
        account_name (current, previous) {
            if(current && !previous){
                this.get_available(true);
            }
        },
        has_scatter (current, previous) {
            if(current && !previous){
                this.get_available(true);
            }
        }
    },
    methods: {
        init () {
            this.page_index = 1;
        },
        reset () {
            this.page_index = 0;
        },
        async get_available(is_circle) {
            if(!this.page_index) return ;
            if(this.is_on_load) return ;
            this.is_on_load = true;
            this.available = await get_available();
            if(this.available.is_error){
                this.scatter_error_info = this.available.msg.message;
            }
            if(!is_circle) return ;
            setTimeout(async () => {
                this.is_on_load = false;
                await this.get_available(is_circle);
            }, 3000);
        },
        async start_action (action_name) {
            let action_map = {
                transfer: {
                    title: lang.data[action_name],
                    struct_action: create_transfer_form
                }
            }
            this.box_action_data = {
                title: action_map[action_name].title,
                on_load: true
            }

            let _form = action_map[action_name].struct_action(
                    this.amount
                );
            let show_list = _form.show_list;
            this.box_action_data = {
                title: action_map[action_name].title,
                action_name,
                show_list,
                on_load: false,
                loadding_form: false,
                error_msg: ''
            }
        },
        clear_action () {
            this.box_action_data = null;
        },
        async confirm (params) {
            if(this.box_action_data.loadding_form){
                return ;
            }
            let action_map = {
                transfer
            }
            let args = params.show_list.get_params();
            if(args.is_error){
                this.box_action_data.error_msg = args.msg;
                return ;
            }
            this.box_action_data.loadding_form = true;
            let res = await action_map[params.action_name](...args);
            if(res.is_error){
                this.box_action_data.error_msg = res.msg;
                this.box_action_data.loadding_form = false;
                return ;
            }
            this.box_action_data = null;
            this.get_available();
        },
        toAsset (eos_num) {
            let val = toAsset(eos_num);
            val = val == '0.0000 EOS' ? 0 : val;
            return val;
        },
        async call_scatter () {
            let res = await get_scatter_identity();
            if(res.is_error){
                this.scatter_error_info = res.msg.message;
            }else{
                window.location.reload(1);    
            }
        }
    }
}
</script>