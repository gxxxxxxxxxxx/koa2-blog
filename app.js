const koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');

const cors = require('koa2-cors')
//引入路由地址
const art = require('./routes/art.js')
const pageconfig = require('./routes/pageconfig.js')
const qnconfig = require('./qiniu.js')
const app = new koa();
const router = new Router();
app.use(cors());
app.use(bodyparser())
app.use(router.routes()).use(router.allowedMethods());




router.get('/',async ctx=>{
    ctx.body={msg:'hello koa'}
})

router.use("/art",art)

router.use("/pageconfig",pageconfig)




router.get('/token',async ctx =>{
    ctx.status = 200;
    ctx.body = qnconfig.uploadToken
})


app.listen(3000,()=>{
    console.log('sever starting...');
    
})