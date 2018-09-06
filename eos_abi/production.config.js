module.exports = {
  apps : [{
    name        : "eos_abi",
    script      : "./src/index.js",
    interpreter : "babel-node",
    watch       : true,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV"   : "production",
       "NODE_PORT"  : 5000
    }
  }
  ]
}