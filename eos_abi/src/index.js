import abi_data from './abi_data.js'

const Express = require('express');
const app = Express();

app.use(Express.json());
const port = process.env.NODE_PORT || 3000;
app.set('port',port);


app.all('/v1/*', (res, req) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.send({});
});

app.all('/v1/chain/get_abi', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.send(abi_data);
});

app.listen(port, () => {
    console.log(`server started and the port is ${port}`);
});

