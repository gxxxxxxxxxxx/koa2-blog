const Router = require('koa-router');
const router = new Router();
const sd = require('silly-datetime');
const dataoperation = require('../dataoperation')

//art
router.get('/artlist', async ctx => {

    //console.log(ctx.request.query.page);

    const artlist = await dataoperation.find(ctx.request.query.page, ctx.request.query.pagemax);
    const total = await dataoperation.findtotal();
    const types = await dataoperation.findtype();
    const news = await dataoperation.findnew();
    const art = {
        artlist,
        total,
        types,
        news
    }
console.log(artlist);

    ctx.body = art

})

//保存文章
router.post('/artlist', async ctx => {
    var time = sd.format(Date.now(), 'YYYY-MM-DD');

    ctx.request.body.date = time
    const art_d = await dataoperation.save(ctx.request.body);

    ctx.status = 200
    ctx.body = art_d

})
//查询单篇文章
router.get('/page', async ctx => {


    const page = await dataoperation.findsingle(ctx.request.query.phid);


    ctx.body = page

})

//删除单篇文章
router.get('/delete', async ctx => {
    const deldeteblog = await dataoperation.deleteblog(ctx.request.query.phid);

    ctx.status = 200
    ctx.body = {
        restext: deldeteblog
    }

})

//更新文章
router.post('/update', async ctx => {

    var time = sd.format(Date.now(), 'YYYY-MM-DD');
    ctx.request.body.date = time
    const updateblog = await dataoperation.updateblog(ctx.request.body)
    ctx.status = 200;
    ctx.body = updateblog
})

//查询归档

router.get('/archive', async ctx => {

    var getarchive = await dataoperation.getarchive()
    var getarchive2 = await dataoperation.getarchive2()


    getarchive.forEach((val, index) => {
        var hash1 = []
        getarchive2.forEach((val2, index) => {
            if (val2.year == val.year) {
                hash1.push(val2)

            }
        })
        val.children = hash1

    });

    ctx.status = 200;
    ctx.body = getarchive

})

//查询分类—文章
router.get('/type_page', async ctx => {

    const results = await dataoperation.type_page(ctx.request.query.phid)

    ctx.status = 200
    ctx.body = results


})

//发送评论

router.post('/comment', async ctx => {
    console.log(ctx.request.body);

    const sendcomment = await dataoperation.sendcomment(ctx.request.body)
    ctx.status = 200;
    ctx.body = sendcomment
})


//展示评论

router.get('/comment', async ctx => {
    if (!ctx.request.query.page_id) {
        return ctx.status = 201;
    }
    const showcomment = await dataoperation.showcomment(ctx.request.query.page_id)
    const showcomment1 = await dataoperation.showcomment1(ctx.request.query.page_id)




    showcomment.forEach((val, index) => {
        let children = []
        showcomment1.forEach((val1, index) => {
            if (val1.p_id == val.phid) {

                children.push(val1)
            }

        })
        val.children = children



    })








    ctx.status = 200;
    ctx.body = showcomment

})






module.exports = router.routes();