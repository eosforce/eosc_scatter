import Eos from 'eosjs'
import {
    toAsset
} from '../components/utils/utils.js'

// 数据同步接口
const httpEndpoint = 'https://w3.eosforce.cn'

// 节点配置
const network = {
    blockchain: 'eos',
    // 若是服务器使用了ssl证书，用https, 若是没用使用http
    protocol: 'https',
    // 节点服务器外围域名
    host: 'explorer.eosforce.io',
    // 端口
    port: 443,
    chainId: 'bd61ae3a031e8ef2f97ee3b0e62776d6d30d4833c8f7c1645c657b149151004b',
}

const scatter_res = {
    'eos': null,
    'account_name': null,
    'permission': null,
    'has_reject': false,
    'is_running': false
}

export const get_scatter_identity = async () => {
    if(scatter_res.is_running){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(get_scatter_identity());
            }, 1000);
        });
    }
    scatter_res.is_running = true;
    const scatter = window.scatter;
    if(!scatter){
        scatter_res.is_running = false;
        return {
            is_error: false,
            data: {
                eos: null,
                account_name: null,
                permission: null
            },
            msg: 'no scatter'
        };
    }
    let identity = await scatter.getIdentity({accounts:[network]}).catch(err => err);
    if(identity.isError){
        scatter_res.has_reject = true;
        scatter_res.error = identity;
        scatter_res.is_running = false;
        return {
            is_error: true,
            msg: identity
        }
    }
    const account = identity.accounts.find(function(acc){
         return acc.blockchain === 'eos';
    });
    let options = {
     authorization: account.name+'@'+account.authority,
     broadcast: true,
     sign: true
    }    
    let eos = scatter.eos(network, Eos,  options, "https");
    scatter_res.is_running = false;
    return {
        is_error: false,
        data: {eos, account_name: account.name, permission: account.authority}
    };
}

const call_scatter = async (call_direct = true) => {
    let {eos, account_name, permission} = scatter_res;
    if(!call_direct && scatter_res.has_reject){
        return {
            is_error: true,
            msg: scatter_res.error
        }
    }
    let is_error = false;
    let error_msg = '';
    if(!eos){
        let identity_res = await get_scatter_identity();
        is_error = identity_res.is_error;
        error_msg = identity_res.msg;
        if(!is_error){
            eos = identity_res.data.eos;
            account_name = identity_res.data.account_name;
            permission = identity_res.data.permission;
            scatter_res.eos = identity_res.data.eos;
            scatter_res.account_name = identity_res.data.account_name;
            scatter_res.permission = identity_res.data.permission;
        }
    }
    if(is_error){
        return {
            is_error,
            msg: error_msg
        };
    }
    return {eos, account_name, permission}
}

export const vote = async (amount = 2, bpname = '', tokenSymbol = 'EOS') => {
    let call_res = await call_scatter();
    if(call_res.is_error) return call_res;
    let {eos, account_name, permission} = call_res;
    return await eos.vote(account_name, bpname, toAsset(amount, tokenSymbol), permission)
        .then(data => {
            return {
                is_error: false,
                data
            };
        })
        .catch(err => {
            return {
                is_error: true,
                msg: err
            };
        });
}

export const transfer = async (to = 'bandon', amount = 1, memo = '', tokenSymbol = 'EOS') => {
    let call_res = await call_scatter();
    if(call_res.is_error) return call_res;
    let {eos, account_name, permission} = call_res;
    let token = await eos.contract(tokenSymbol === 'EOS' ? 'eosio' : 'eosio.token').then(token => { return token });
    return await token.transfer(account_name, to, toAsset(amount), memo, permission)
                .then(data => {
                    return {
                        is_error: false,
                        data
                    }
                });
}

export const unfreeze = async (bpname = '') => {
    let call_res = await call_scatter();
    if(call_res.is_error) return call_res;
    let {eos, account_name, permission} = call_res;
    return await eos.unfreeze(account_name, bpname, permission)
                .then(data => {
                    return {
                        is_error: false,
                        data
                    };
                })
                .catch(err => {
                    return {
                        is_error: true,
                        msg: err
                    };
                });
};

export const claim = async (bpname) => {
    let call_res = await call_scatter();
    if(call_res.is_error) return call_res;
    let {eos, account_name, permission} = call_res;
    return await eos.claim(account_name, bpname, permission)
                .then(data => {
                    return {
                        is_error: false,
                        data
                    };
                })
                .catch(err => {
                    return {
                        is_error: true,
                        msg: err
                    };
                });
};

export const get_my_vote_llist = async () => {
    let call_res = await call_scatter(false);
    if(call_res.is_error) return call_res;
    let {eos, account_name, permission} = call_res;

    if(!account_name){
        return {
            is_error: true,
            msg: ''
        };
    }

    return await Eos({ httpEndpoint })
                .getTableRows({ scope: account_name, code: 'eosio', table: 'votes', json: true, limit: 1000 })
                .then(data => {
                    return {
                        is_error: false,
                        data,
                        account_name
                    };
                })
                .catch(err => {
                    return {
                        is_error: true,
                        msg: err
                    };
                });
}

export const get_available = async () => {
    let call_res = await call_scatter(false);
    if(call_res.is_error) return call_res;
    let {eos, account_name, permission} = call_res;
    if(!account_name){
        return {
            is_error,
            msg: ''
        };
    }
    return await Eos({ httpEndpoint })
                .getTableRows({"scope":"eosio","code":"eosio","table":"accounts","table_key":account_name,"limit":10000,"json":true})
                .then(data => {
                    return {
                        is_error: false,
                        data
                    };
                })
                .catch(err => {
                    return {
                        is_error: true,
                        msg: err
                    };
                });
}

export const get_top_bps = () => {
    return new Promise(async (resolve, reject) => {
        let {last_irreversible_block_num, head_block_num} = await Eos({ httpEndpoint }).getInfo({});
        let {schedule_version} = await Eos({ httpEndpoint }).getBlock({block_num_or_id: last_irreversible_block_num});
        let top_bps = await Eos({ httpEndpoint }).getTableRows({"scope":"eosio","code":"eosio","table":"schedules","table_key":schedule_version,"json":true,"limit":1000});
        resolve({rows: top_bps.rows[0], schedule_version, head_block_num});
    });
}

export const get_bps = () => {
    return new Promise((resolve, reject) => {
        Eos({ httpEndpoint })
        .getTableRows({ scope: 'eosio', code: 'eosio', table: 'bps', json: true, limit: 1000 })
        .then(async data => {
            resolve({
                is_error: false,
                data: data.rows
            });
        })
        .catch(err => {
            resolve({
                is_error: true,
                msg: err
            });
        })
    });
}

