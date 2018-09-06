<style>
.web_wallet_close{
    top: 17px;
    cursor: pointer;
}
.dialog_mask{
    position: fixed;
    background-color: rgba(51,51,51,.5);
    z-index: 21;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
}
.dialog{
    width: 428px;
    height: auto;
    box-sizing: border-box;
    border: 0px solid #333333b5;
    background-color: #fff;
    position: absolute;
    left: 50%;
    margin-left: -214px;
    top: 100px;
    box-shadow: 0 1px 25px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
}
.dialog_title{
    font-size: 16px;
    line-height: 1;
    padding: 20px 20px;
    color: #333;
    border-bottom: 1px solid #eee;
}
.dialog_content_ct{
    margin: 10px;
    margin-top: 0px;
    font-size: 14px;
    line-height: 26px;
    padding: 10px;
}
.dialog_item{
    padding: 10px 0px;
    color: #262626;
    display: flex;
    justify-content: space-between;
}
.dialog_confirm{
    background: #0070e0;
    margin: 10px;
    text-align: center;
    color: #fff;
    line-height: 1;
    padding: 13px;
    border-radius: 3px;
    cursor: pointer;
}
.dialog_confirm:hover{
    background: #0060e0;
}
.error_msg{
    color: #e01a00;
    text-align: center;
}
.subloading{
    height: 14px;
}
.ipt{
    padding: 6px 10px;
    margin-right: 4px;
    border: 1px solid #9a9999;
    box-shadow: 0px 0px 2px #eee;
    width: 100px;
    border-radius: 3px;
}
.max_ipt{
    width: 300px;
}
.item_info_txt{
    font-size: 12px;
    color: #868383;
}
</style>
<template>
    <div class="dialog_mask" v-if="show">
        <div class="dialog">
            <div class="close_nav web_wallet_close" @click="hide"></div>
            <div class="dialog_title">{{params.title}}</div>
            <div class="dialog_content_ct">
                <div class="error_msg">{{ params.error_msg }}</div>
                <div class="base_load_ct bigger_load" v-if="params.on_load">
                    <div class="load_circle"></div>
                </div>
                <div v-for="item in params.show_list" v-if="!params.on_load">
                    <div class="dialog_item">
                        <span>{{ item.title }}</span>
                        <span class="blue_ft" v-if="item.type=='txt'">{{ item.value }}</span>
                        <span  v-if="item.type=='input'">
                            <input type="" name="" v-model="item.value" v-bind:placeholder="item.placeholder" class="ipt" />
                            <span>{{ item.exe }}</span>
                        </span>
                        <span  v-if="item.type=='max_input'">
                            <textarea type="" name="" v-model="item.value" v-bind:placeholder="item.placeholder" class="ipt max_ipt" ></textarea>
                            <span>{{ item.exe }}</span>
                        </span>
                    </div>
                    <div class="item_info_txt" v-if="item.info_txt">
                        {{ item.info_txt }}
                    </div>
                </div>
            </div>

            <div class="dialog_confirm" v-on:click="confirm" v-if="!params.hide_confirm&&!params.on_load">
                <span v-if="!params.loadding_form">{{ lang.submit }}</span>
                <div class="base_load_ct subloading" v-if="params.loadding_form">
                    <div class="load_circle"></div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import {
    time_plus_hours
} from '../utils/utils.js'
import { 
    lang
} from '../../data/lang.js'

export default {
    data () {
        return {
            on_load: true,
            show: true,
            data : [],
            lang: lang.data,
        };
    },
    props: {
        params: {
            type: Object,
            default () {
                return {
                    title: '',
                    action_name: '',
                    show_list: [],
                    on_load: true
                }
            }
        }
    },
    methods: {
        hide () {
            this.show = false;
            this.$emit('hide');
        },
        confirm () {
            this.$emit('confirm', this.params);
        }
    }
}
</script>