<style>
    .wallet_table .base_tb_ct tr td, .wallet_table .base_tb_ct tr th{
        padding: 5px 10px;
    }
    .gray_ft{
        color: #888;
    }
    .gray_ft:hover{
        color: #888;
    }
    .unfreeze_tag{
        border: 1px solid #0070e0;
        line-height: 1;
        font-size: 12px;
        padding: 2px;
        border-radius: 3px;
        color: #0070e0;
        transform: scale(0.8);
        display: inline-block;
        margin-left: -4px;
    }
</style>
<template>
    <div class="base_table">
        <div class="tb_title">
            <span class="tb_title_txt">{{ lang.web_wallet_view }}</span>
        </div>
        <div class="wallet_table">
            <div class="no_data" v-if="!on_load && !show_data.length">
                当前无数据
            </div>
            <div class="table_config" v-if="(on_load && !this.show_data.length && is_auto_load) || (!is_auto_load && on_load)">
                <div class="fakeloader">
                    <div class="fl spinner4"></div>
                </div>
            </div>
            <div class="tb_ct">
                <table class="base_tb_ct"  v-if="(!on_load && this.show_data.length) || (is_auto_load && on_load && this.show_data.length)">
                    <tr>
                        <th>
                            #
                        </th>
                        <th>
                            {{ lang.bpname }}
                        </th>
                        <th>
                            {{ lang.bound_percent }}
                        </th>
                        <th>
                            {{ lang.bonus_rate }}
                        </th>
                        <th>
                            {{ lang.votes_received }}
                        </th>
                        <th>
                            {{ lang.reward_pool }}
                        </th>
                        <th>
                            {{ lang.my_vote }}
                        </th>
                        <th>
                            {{ lang.your_reward }}
                        </th>
                        <th>
                            {{ lang.redemption }}
                        </th>
                        <th>
                            {{ lang.action_area }}
                        </th>
                    </tr>
                    <tr v-for="item, index in show_data" v-bind:class="{'tr_bg': index%2}">
                        <td>
                            {{ index + 1 }}
                        </td>
                        <td>
                            {{ item.name }}
                        </td>
                        <td>
                            {{ item.share_percent/100 + '%' }}
                        </td>
                        <td>
                            {{ item.annualized }}
                        </td>
                        <td>
                            {{ split_long_num(item.total_staked) }}
                        </td>
                        <td>
                            {{ split_long_num(item.rewards_pool) }}
                        </td>
                        <td >
                            <span v-if="my_vote_list_keys.indexOf(item.name) > -1">{{ toAsset(select_my_vote(item.name).staked) }}</span>
                            <span v-if="my_vote_list_keys.indexOf(item.name) < 0">0</span>
                        </td>
                        <td>
                            {{ item.reward }}
                        </td>
                        <td >
                            <div v-if="my_vote_list_keys.indexOf(item.name) > -1" >
                                <span>{{ toAsset(select_my_vote(item.name).unstaking) }}</span>
                                <span class="unfreeze_tag" v-if="isLock(select_my_vote(item.name).unstake_height, select_my_vote(item.name).unstaking)">
                                    {{ lang.unfreeze }}
                                </span>
                            </div>
                            <span v-if="my_vote_list_keys.indexOf(item.name) < 0">
                                0
                            </span>
                        </td>
                        <td>
                            <div class="action_ct">
                                <template  v-if="has_scatter">
                                    <a href="javascript:;" class="blue_ft" @click="start_action('vote', item)">{{ lang.vote }}</a>    
                                    <span class="splite_line">|</span>
                                    <a href="javascript:;" class="blue_ft" @click="start_action('claim', item)">{{ lang.claim }}</a>
                                    <span class="splite_line">|</span>
                                    <a href="javascript:;" class="blue_ft" @click="start_action('minus_vote', item)">{{ lang.minus_vote }}</a>
                                    <span class="splite_line">|</span>
                                    <a href="javascript:;" class="blue_ft" @click="start_action('unfreeze', item)" v-if="isLock(select_my_vote(item.name).unstake_height, select_my_vote(item.name).unstaking)">{{ lang.unfreeze }}</a>
                                    <a href="javascript:;" class="gray_ft" v-if="!isLock(select_my_vote(item.name).unstake_height, select_my_vote(item.name).unstaking)"">{{ lang.unfreeze }}</a>
                                </template>
                                <a href="https://github.com/gpmn/scatter_demo" target="_blank" class="blue_ft" v-if="!has_scatter">{{ lang.config_scatter }}</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <box v-if="box_action_data" v-bind:params="box_action_data" v-on:hide="clear_action" v-on:confirm="confirm"></box>
        </div>
    </div>
</template>
<script>
import '../../assets/css/index.css'
import '../../assets/css/fadeload.css'
import '../../assets/image/web/favicon.ico'
import {
    get_bps, vote, transfer, unfreeze, claim, get_my_vote_llist, get_top_bps, get_available
} from '../../service/web_wallet_service.js'
import { 
    log, 
    time_plus_hours, 
    split_long_num,
    calcApr,
    calcVoteage,
    calcReward,
    toAsset,
    formatNumber
} from '../utils/utils.js'
import {
    create_vote_form,
    create_claim_form,
    create_minus_vote_form,
    create_unfreeze_form
} from './action_form.js'
import { lang } from '../../data/lang.js'
import store from '../../data/store.js'
import box from '../box/index.vue'
export default {
    data () {
        return {
            on_load: false,
            is_auto_load: false,
            on_load_table: false,
            has_more: true,
            load_timestamp: new Date().getTime(),
            page_index: 1,
            page_num: 1,
            page_items_num: 10,
            show_data: [],
            my_vote_list: [],
            top_bps: [],
            page_list: [],
            lang: lang.data,
            box_action_data: null,
            account_name: '',
            available: {},
            schedule_version: 0,
            head_block_num: 0,
            total_staked: 0,
            // 创世用户资产
            origin_assets: 896688626.68,
        }
    },
    components:{
        box,
    },
    computed: {
        has_scatter () {
            return store.state.global_config.has_scatter;  
        },
        my_vote_list_keys () {
            return this.my_vote_list.map(item => item.bpname);
        }
    },
    mounted () {
        this.init();
        this.get_data(true);
        this.get_my_vote_llist();
    },
    destroyed () {
        this.reset();
    },
    methods: {
        init () {
            this.page_index = 1;
        },
        reset () {
            this.page_index = 0;
        },
        async get_available() {
            if(!this.page_index) return;
            if(this.account_name){
                this.available = await get_available();
            }
            setTimeout(() => {
                this.get_available();
            }, 3000);
        },
        async get_data(need_load){
            if(!this.page_index) return;
            if(this.on_load_table) return ;
            this.on_load_table = true;
            this.is_auto_load = need_load;
            let post_time = need_load ? this.start_load( need_load ) : new Date().getTime();
            let [top_bps, bps] = await Promise.all([get_top_bps(), get_bps()]);
            await this.get_my_vote_llist();
            let schedule_version = this.schedule_version = top_bps.schedule_version,
                head_block_num = this.head_block_num = top_bps.head_block_num;
            let top_bps_keys = top_bps.rows.producers.map(item => item.bpname);
            let top_bps_arr = [], not_top_bps_arr = [], total_staked = 0;
            bps.data.forEach(item => {
                total_staked += item.total_staked;
                item.annualized = parseInt((calcApr(item.total_staked, item.commission_rate)) * 100) + '%';
                let my_vote = this.select_my_vote(item.name);
                const bpVoteage = calcVoteage([item.total_voteage, item.total_staked, head_block_num, item.voteage_update_height, ]);
                const myVoteage = calcVoteage([my_vote.voteage, my_vote.staked, head_block_num, my_vote.voteage_update_height]);
                item.reward = this.toAsset(calcReward([myVoteage, bpVoteage, item.rewards_pool])); 
                item.reward = parseFloat(item.reward) * 1 > 0 ? item.reward : 0;
                item.voter = this.account_name;
                item.share_percent = (10000 - item.commission_rate)
                if(top_bps_keys.indexOf(item.name) > -1) {
                    top_bps_arr.push(item)
                    return ;
                }
                not_top_bps_arr.push(item);
            });
            this.total_staked = total_staked;
            top_bps_arr = top_bps_arr.sort((pre, next) => {
                let pre_staked = parseInt(pre.total_staked);
                let next_staked = parseInt(next.total_staked);
                if(pre_staked > next_staked){
                    return -1;
                }else{
                    return 1;
                }
            });
            not_top_bps_arr = not_top_bps_arr.sort((pre, next) => {
                let pre_staked = parseInt(pre.total_staked);
                let next_staked = parseInt(next.total_staked);
                if(pre_staked > next_staked){
                    return -1;
                }else{
                    return 1;
                }
            });
            this.show_data.splice(0, this.show_data.length, ...top_bps_arr,...not_top_bps_arr);
            this.finish_load();
            this.on_load_table = false;
            setTimeout(() => {
                this.get_data(false);
            }, 3000);
        },
        async get_my_vote_llist () {
            let my_vote_list = await get_my_vote_llist();
            if(my_vote_list.is_error) {return;}
            this.my_vote_list.splice(0, this.my_vote_list.length, ...my_vote_list.data.rows);
            this.account_name = my_vote_list.account_name;
        },
        async get_top_bps () {
            let top_bps = await get_top_bps();
            this.top_bps.splice(0, this.top_bps.length, ...top_bps.producers);
        },
        select_my_vote (key) {
            for(let row of this.my_vote_list){
                if(key == row.bpname){
                    return row;
                }
            }
            return {'staked': '0'}
        },
        async start_action (action_name, item) {
            let action_map = {
                vote: {
                    title: lang.data[action_name],
                    struct_action: create_vote_form
                },
                claim: {
                    title: lang.data[action_name],
                    struct_action: create_claim_form
                },
                minus_vote: {
                    title: lang.data[action_name],
                    struct_action: create_minus_vote_form
                },
                unfreeze: {
                    title: lang.data[action_name],
                    struct_action: create_unfreeze_form
                }
            }
            this.box_action_data = {
                title: action_map[action_name].title,
                on_load: true
            }

            let available = null;

            if(action_name != 'claim' && action_name != 'unfreeze'){
                available = await get_available();
                if(available.is_error){
                    this.box_action_data.error_msg = available.msg;
                    this.box_action_data.on_load = false;
                    this.box_action_data.hide_confirm = true;
                    return;
                }
            }

            let _form = null;
            if(action_name == 'vote' || action_name == 'minus_vote'){
                _form = action_map[action_name].struct_action(
                    item.name,
                    this.select_my_vote(item.name).staked,
                    available.data.rows[0].available,
                    ''
                );
            }
            if(action_name == 'claim'){
                _form = action_map[action_name].struct_action(
                    item.name,
                    item.reward,
                    item.voter
                );
            }
            if(action_name == 'unfreeze'){
                _form = action_map[action_name].struct_action(
                    item.name,
                    item.voter,
                    toAsset(this.select_my_vote(item.name).unstaking)
                );
            }
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
                vote,
                unfreeze,
                claim,
                minus_vote: vote
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
            this.get_data(false);
        },
        toAsset (eos_num) {
            let val = toAsset(eos_num);
            val = val == '0.0000 EOS' ? 0 : val;
            return val;
        },
        start_load (direct_load) {
            let load_timestamp = new Date().getTime();
            this.load_timestamp = load_timestamp;
            if(direct_load){
                this.on_load = true;
                return this.load_timestamp;
            }
            setTimeout(() => {
                if(this.load_timestamp == load_timestamp){
                    this.on_load = true;        
                }
            }, 500);
            return this.load_timestamp;
        },
        finish_load () {
            this.load_timestamp = new Date().getTime();
            this.on_load = false;
        },
        isLock(unstakeHeight, unstaking) {
          if (unstakeHeight === undefined || !parseInt(unstaking + '')) return 0;
          let need_seconds = unstakeHeight + 86400 - this.head_block_num;
          if(need_seconds < 0){
            return need_seconds;
          }
          return false;
        },
        split_long_num,
        formatNumber
    }
}
</script>



