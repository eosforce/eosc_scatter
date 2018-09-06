import { lang } from '../../data/lang.js'
export const create_vote_form = (bpname, staked, available, change) => {
    let show_list = [
        {
            type: 'txt',
            title: lang.data.bpname,
            name: 'bpname',
            param: true,
            param_index: 0,
            value: bpname
        },
        {
            type: 'txt',
            title: lang.data.my_vote,
            param: true,
            name: 'staked',
            value: staked
        },
        {
            type: 'txt',
            title: lang.data.fee,
            param: true,
            name: 'fee',
            value: '0.0500 EOS'
        },
        {
            type: 'txt',
            title: lang.data.available,
            param: true,
            name: 'available',
            value: available
        },
        {
            type: 'input',
            title: lang.data.added_vote,
            placeholder: lang.data.added_vote,
            param: true,
            param_index: 1,
            name: 'change',
            value: '',
            exe: 'EOS'
        }
    ]

    show_list.get_params = () => {
        let args = {};
        show_list.filter(item => {
            if(item.param){
                args[item.name] = item.value;
            }
        });
        args.change = parseInt(args.change);
        args.staked = parseInt(args.staked)||0;
        args.available = parseInt(args.available)||0;
        args.fee = parseInt(args.fee)||0;
        if(!args.change){
            return {
                is_error: true,
                msg: lang.data.vote_more_than_zero || '投注金额不能为0'
            }
        }
        if(args.change + args.fee > args.available){
            return {
                is_error: true,
                msg: lang.data.not_enough_eos || '可用余额不足'
            };
        }
        let total = args.staked + args.change;
        return [total, args.bpname];
    }

    let proxy = new Proxy(show_list, {
        set (target, key, receiver) {
           show_list.find(item => {
            if(item.name == key){
                item.value = receiver;
            }
           }) 
        }
    })
    return {
        proxy,
        show_list
    }
}


export const create_claim_form = (bpname, ammout, voter) => {
    let show_list = [
        {
            type: 'txt',
            title: lang.data.bpname,
            name: 'bpname',
            param: true,
            param_index: 0,
            value: bpname
        },
        {
            type: 'txt',
            title: lang.data.voter,
            param: false,
            name: 'voter',
            value: voter
        },
        {
            type: 'txt',
            title: lang.data.fee,
            param: true,
            name: 'fee',
            value: '0.0300 EOS'
        },
        {
            type: 'txt',
            title: lang.data.your_reward,
            param: true,
            name: 'ammout',
            value: ammout
        }
    ]

    show_list.get_params = () => {
        let args = {};
        show_list.filter(item => {
            if(item.param){
                args[item.name] = item.value;
            }
        });
        args.fee = parseInt(args.fee)||0;
        if(!args.bpname){
            return {
                is_error: true,
                msg: lang.data.choose_a_bp || '请选择节点'
            }
        }
        if(args.fee > args.available){
            return {
                is_error: true,
                msg: lang.data.not_enough_eos || '可用余额不足'
            };
        }
        return [args.bpname];
    }

    let proxy = new Proxy(show_list, {
        set (target, key, receiver) {
           show_list.find(item => {
            if(item.name == key){
                item.value = receiver;
            }
           }) 
        }
    })
    return {
        proxy,
        show_list
    }
}

export const create_minus_vote_form = (bpname, staked, available, change) => {
    let show_list = [
        {
            type: 'txt',
            title: lang.data.bpname,
            name: 'bpname',
            param: true,
            param_index: 0,
            value: bpname
        },
        {
            type: 'txt',
            title: lang.data.fee,
            param: true,
            name: 'fee',
            value: '0.0500 EOS'
        },
        {
            type: 'txt',
            title: lang.data.available,
            param: true,
            name: 'available',
            value: available
        },
        {
            type: 'txt',
            title: lang.data.number_you_redemption,
            param: true,
            name: 'staked',
            value: staked
        },
        {
            type: 'input',
            title: lang.data.redemption_num,
            param: true,
            param_index: 1,
            name: 'change',
            value: '',
            exe: 'EOS',
            info_txt: lang.data.minus_vote_info
        }
    ]

    show_list.get_params = () => {
        let args = {};
        show_list.filter(item => {
            if(item.param){
                args[item.name] = item.value;
            }
        });
        args.change = parseInt(args.change);
        args.staked = parseInt(args.staked)||0;
        args.available = parseInt(args.available)||0;
        args.fee = parseInt(args.fee)||0;
        if(!args.change){
            return {
                is_error: true,
                msg: lang.data.more_than_zero_of_minus || '赎回金额必须大于0'
            }
        }
        if(args.fee > args.available){
            return {
                is_error: true,
                msg: lang.data.not_enough_eos || '可用余额不足'
            };
        }
        if(args.change > args.staked){
            return {
                is_error: true,
                msg: lang.data.no_more_than_vote || '赎回金额不能大于已有投票数额'
            };
        }
        let total = args.staked - args.change;
        return [total, args.bpname];
    }

    let proxy = new Proxy(show_list, {
        set (target, key, receiver) {
           show_list.find(item => {
            if(item.name == key){
                item.value = receiver;
            }
           }) 
        }
    })
    return {
        proxy,
        show_list
    }
}


export const create_transfer_form = (available) => {
    let show_list = [
        {
            type: 'txt',
            title: lang.data.fee,
            param: true,
            name: 'fee',
            value: '0.0100 EOS'
        },
        {
            type: 'txt',
            title: lang.data.available,
            param: true,
            name: 'available',
            value: available
        },
        {
            type: 'input',
            title: lang.data.transfer_to || '转账对象',
            param: true,
            param_index: 1,
            name: 'transfer_to',
            value: '',
            exe: ''
        },
        {
            type: 'input',
            title: lang.data.transfer_number || '转账数额',
            param: true,
            param_index: 1,
            placeholder: 'EOS',
            name: 'transfer_number',
            value: '',
            exe: ''
        },
        {
            type: 'max_input',
            title: lang.data.transfer_comment|| '转账数额',
            param: true,
            param_index: 1,
            placeholder: lang.data.max_words_256,
            name: 'transfer_comment',
            value: '',
            exe: ''
        }
    ]

    show_list.get_params = () => {
        let args = {};
        show_list.filter(item => {
            if(item.param){
                args[item.name] = item.value;
            }
        });
        args.transfer_number = parseFloat(args.transfer_number);
        args.staked = parseInt(args.staked)||0;
        args.available = parseInt(args.available)||0;
        args.fee = parseInt(args.fee)||0;
        if(!args.transfer_to){
            return {
                is_error: true,
                msg: lang.data.has_no_transfer_object || '转账对象未填写'
            }
        }
        if(!args.transfer_number){
            return {
                is_error: true,
                msg: lang.data.transfer_num_error || '转账数额不能为0, 并且只能为数字'
            }
        }
        if(args.transfer_comment.length > 256){
            return {
                is_error: true,
                msg: lang.data.transfer_comment_num_err || '最大长度不能大于256'
            }
        }
        return [args.transfer_to, args.transfer_number, args.transfer_comment];
    }

    let proxy = new Proxy(show_list, {
        set (target, key, receiver) {
           show_list.find(item => {
            if(item.name == key){
                item.value = receiver;
            }
           }) 
        }
    })
    return {
        proxy,
        show_list
    }
}

export const create_unfreeze_form = (bpname, voter, unstaking_num) => {
    let show_list = [
        {
            type: 'txt',
            title: lang.data.bpname,
            name: 'bpname',
            param: true,
            param_index: 0,
            value: bpname
        },
        {
            type: 'txt',
            title: lang.data.fee,
            param: true,
            name: 'fee',
            value: '0.01 EOS'
        },
        {
            type: 'txt',
            title: lang.data.voter,
            param: false,
            name: 'voter',
            value: voter
        },
        {
            type: 'txt',
            title: lang.data.unstaking_num || '解冻金额',
            param: true,
            param_index: 1,
            name: 'unstaking_num',
            value: unstaking_num,
            exe: ''
        }
    ]

    show_list.get_params = () => {
        let args = {};
        show_list.filter(item => {
            if(item.param){
                args[item.name] = item.value;
            }
        });
        
        return [args.bpname];
    }

    let proxy = new Proxy(show_list, {
        set (target, key, receiver) {
           show_list.find(item => {
            if(item.name == key){
                item.value = receiver;
            }
           }) 
        }
    })
    return {
        proxy,
        show_list
    }
}