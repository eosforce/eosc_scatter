export default {
    "account_name": "eosio",
    "abi": {
        "version": "eosio::abi/1.0",
        "types": [],
        "structs": [
        {
            "name": "wait_weight",
            "base": "",
            "fields": [
                {
                    "name": "wait_sec",
                    "type": "uint32"
                },
                {
                    "name": "weight",
                    "type": "weight_type"
                }
            ]
        },
        {
            "name": "permission_level_weight",
            "base": "",
            "fields": [
                {
                    "name": "permission",
                    "type": "permission_level"
                },
                {
                    "name": "weight",
                    "type": "weight_type"
                }
            ]
        },
        {
            "name": "key_weight",
            "base": "",
            "fields": [
                {
                    "name": "key",
                    "type": "public_key"
                },
                {
                    "name": "weight",
                    "type": "weight_type"
                }
            ]
        },
        {
            "name": "authority",
            "base": "",
            "fields": [
                {
                    "name": "threshold",
                    "type": "uint32"
                },
                {
                    "name": "keys",
                    "type": "key_weight[]"
                },
                {
                    "name": "accounts",
                    "type": "permission_level_weight[]"
                },
                {
                    "name": "waits",
                    "type": "wait_weight[]"
                }
            ]
        },
        {
            "name": "newaccount",
            "base": "",
            "fields": [{
                "name": "creator",
                "type": "account_name"
            }, {
                "name": "name",
                "type": "account_name"
            }, {
                "name": "owner",
                "type": "authority"
            }, {
                "name": "active",
                "type": "authority"
            }]
        },{
            "name": "transfer",
            "base": "",
            "fields": [{
                "name": "from",
                "type": "account_name"
            }, {
                "name": "to",
                "type": "account_name"
            }, {
                "name": "quantity",
                "type": "asset"
            }, {
                "name": "memo",
                "type": "string"
            }]
        }, {
            "name": "updatebp",
            "base": "",
            "fields": [{
                "name": "bpname",
                "type": "account_name"
            }, {
                "name": "block_signing_key",
                "type": "public_key"
            }, {
                "name": "commission_rate",
                "type": "uint32"
            }, {
                "name": "url",
                "type": "string"
            }]
        }, {
            "name": "unfreeze",
            "base": "",
            "fields": [{
                "name": "voter",
                "type": "account_name"
            }, {
                "name": "bpname",
                "type": "account_name"
            }]
        }, {
            "name": "claim",
            "base": "",
            "fields": [{
                "name": "voter",
                "type": "account_name"
            }, {
                "name": "bpname",
                "type": "account_name"
            }]
        }, {
            "name": "account_info",
            "base": "",
            "fields": [{
                "name": "name",
                "type": "account_name"
            }, {
                "name": "available",
                "type": "asset"
            }]
        }, {
            "name": "vote_parameter",
            "base": "",
            "fields": [{
                "name": "voter",
                "type": "account_name"
            }, {
                "name": "bpname",
                "type": "account_name"
            }, {
                "name": "change",
                "type": "asset"
            }]
        }, {
            "name": "vote",
            "base": "",
            "fields": [{
                "name": "voter",
                "type": "account_name"
            }, {
                "name": "bpname",
                "type": "account_name"
            }, {
                "name": "change",
                "type": "asset"
            }]
        }, {
            "name": "vote_info",
            "base": "",
            "fields": [{
                "name": "bpname",
                "type": "account_name"
            }, {
                "name": "staked",
                "type": "asset"
            }, {
                "name": "voteage",
                "type": "int64"
            }, {
                "name": "voteage_update_height",
                "type": "uint32"
            }, {
                "name": "unstaking",
                "type": "asset"
            }, {
                "name": "unstake_height",
                "type": "uint32"
            }]
        }, {
            "name": "bp_info",
            "base": "",
            "fields": [{
                "name": "name",
                "type": "account_name"
            }, {
                "name": "block_signing_key",
                "type": "public_key"
            }, {
                "name": "commission_rate",
                "type": "uint32"
            }, {
                "name": "total_staked",
                "type": "int64"
            }, {
                "name": "rewards_pool",
                "type": "asset"
            }, {
                "name": "total_voteage",
                "type": "int64"
            }, {
                "name": "voteage_update_height",
                "type": "uint32"
            }, {
                "name": "url",
                "type": "string"
            }, {
                "name": "emergency",
                "type": "bool"
            }]
        }, {
            "name": "setemergency",
            "base": "",
            "fields": [{
                "name": "bpname",
                "type": "account_name"
            }, {
                "name": "emergency",
                "type": "bool"
            }]
        }, {
            "name": "chain_status",
            "base": "",
            "fields": [{
                "name": "name",
                "type": "account_name"
            }, {
                "name": "emergency",
                "type": "bool"
            }]
        }, {
            "name": "producer",
            "base": "",
            "fields": [{
                "name": "bpname",
                "type": "account_name"
            }, {
                "name": "amount",
                "type": "uint32"
            }]
        }, {
            "name": "schedule_info",
            "base": "",
            "fields": [{
                "name": "version",
                "type": "uint64"
            }, {
                "name": "block_height",
                "type": "uint32"
            }, {
                "name": "producers",
                "type": "producer[]"
            }]
        }],
        "actions": [
        {
            "name": "newaccount",
            "type": "newaccount",
            "ricardian_contract": ""
        },{
            "name": "transfer",
            "type": "transfer",
            "ricardian_contract": ""
        }, {
            "name": "updatebp",
            "type": "updatebp",
            "ricardian_contract": ""
        }, {
            "name": "vote",
            "type": "vote_parameter",
            "ricardian_contract": ""
        }, {
            "name": "unfreeze",
            "type": "unfreeze",
            "ricardian_contract": ""
        }, {
            "name": "claim",
            "type": "claim",
            "ricardian_contract": ""
        }, {
            "name": "setemergency",
            "type": "setemergency",
            "ricardian_contract": ""
        }],
        "tables": [{
            "name": "accounts",
            "index_type": "i64",
            "key_names": ["name"],
            "key_types": ["account_name"],
            "type": "account_info"
        }, {
            "name": "bps",
            "index_type": "i64",
            "key_names": ["name"],
            "key_types": ["account_name"],
            "type": "bp_info"
        }, {
            "name": "votes",
            "index_type": "i64",
            "key_names": ["bpname"],
            "key_types": ["account_name"],
            "type": "vote_info"
        }, {
            "name": "chainstatus",
            "index_type": "i64",
            "key_names": ["name"],
            "key_types": ["account_name"],
            "type": "chain_status"
        }, {
            "name": "schedules",
            "index_type": "i64",
            "key_names": ["version"],
            "key_types": ["uint64"],
            "type": "schedule_info"
        }],
        "ricardian_clauses": [],
        "error_messages": [],
        "abi_extensions": []
    }
};