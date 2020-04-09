const Router = require('koa-router');
const router = new Router();

const dataoperation = require('../dataoperation')



router.get('/types',async ctx =>{

const types = await dataoperation.gettypes();
ctx.status = 200
ctx.body = types

})

router.post('/types',async ctx =>{
    const types = await dataoperation.savetypes(ctx.request.body)
    
    ctx.status = 200
    ctx.body = types

})



module.exports = router.routes();