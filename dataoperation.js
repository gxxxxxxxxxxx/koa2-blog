const mysql = require('mysql');
const config = require('./config/default')
const sd = require('silly-datetime');


const connection = mysql.createConnection({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    
});




connection.connect();


//查询文章列表
exports.find = (page, pagemax) => {
    return new Promise((resolve, reject) => {
        page = (page - 1) * pagemax
       
            connection.query(`select a.phid,a.title,a.jianjie,a.date,a.liulanliang,a.imageurl,b.name from art_m a left join types b on b.phid = a.types order by date DESC limit ${page},${pagemax};`, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    return reject(error)


                }
                resolve(results)

               
            })
        })
    

}
//查询文章总数
exports.findtotal = () => {
    return new Promise((resolve, reject) => {
        
        connection.query('select COUNT(*) as total from art_m ', function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)


            }
            resolve(results)

        
        
    })
    })

}
//查询分类参数
exports.findtype = () => {
    return new Promise((resolve, reject) => {



        
        findsql = "select DISTINCT  b.phid,b.name,(select count(types) as total from art_m where types !='null'  and types = a.types) as total from art_m  a left join types b on b.phid = a.types where b.phid is not null LIMIT 4  "


        connection.query(findsql, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve(results)
           
        })
    
    })
}
//查询最新推荐
exports.findnew = () => {
    return new Promise((resolve, reject) => {
       
        findsql = "select * from art_m order by date desc LIMIT 3  "


        connection.query(findsql, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve(results)
          
        })
    
    })
}







//查询单篇文章

exports.findsingle = (phid) => {
    return new Promise((resolve, reject) => {
        
        connection.query(`select phid,title,jianjie,date,liulanliang,content,imageurl,types from art_m where phid=${phid}`, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)


            }
            resolve(results)

           
        })
    
    })

}



//保存文章
exports.save = (res) => {
    return new Promise((resolve, reject) => {
      
        var savesql = 'insert into art_m value(null,?,?,?,?,?,?,?)';
        var savesql_Params = [res.art.title, res.art.jianjie, res.date, 0, res.markdown, res.art.imageurl, res.art.typesvalue];
        connection.query(savesql, savesql_Params, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve('保存成功')
            
        })
   

    })
}

//删除单篇文章

exports.deleteblog = (phid) => {
    return new Promise((resolve, reject) => {
        
        connection.query('delete from art_m where phid=' + phid, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve('删除成功')

           
        })
   
    })
}


//更新文章
exports.updateblog = (res) => {
    return new Promise((resolve, reject) => {
       
        var updatesql = `update art_m set title = '${res.art.title}',jianjie = '${res.art.jianjie}',date = '${res.date}',content = '${res.markdown}',imageurl= '${res.art.imageurl}',types='${res.art.typesvalue}' where phid = '${res.phid}'`
        connection.query(updatesql, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve('更新成功')
          
        })

    

    })
}

//获取分类参数

exports.gettypes = (res) => {
    return new Promise((resolve, reject) => {
      
        var getsql = "select DISTINCT  b.phid,b.name,(select count(types) as total from art_m where types !='null'  and types = a.types) as total from art_m  a left join types b on b.phid = a.types where b.phid is not null  "
        connection.query(getsql, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve(results)
            
        })
    
    })
}

//保存分类参数

exports.savetypes = (res) => {
    return new Promise((resolve, reject) => {
        
        var savesql = `insert into types(NAME) value('${res.name}')`;
        connection.query(savesql, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve('保存参数成功')
           
        })
    
    })
}

//查询归档信息

exports.getarchive = (res) => {
    return new Promise((resolve, reject) => {
        
        let sql1 = "select distinct DATE_FORMAT(date, '%Y') as year from art_m"
        connection.query(sql1, function (error, results, fields) {


            resolve(results)
          
        })
    
    })
}
//查询归档信息2

exports.getarchive2 = (res) => {
    return new Promise((resolve, reject) => {
       
        let sql1 = "select phid,title,DATE_FORMAT(date, '%Y-%m-%d') as date, DATE_FORMAT(date, '%Y') as year,(select name from types where phid =art_m.types ) as typename from art_m"
        connection.query(sql1, function (error, results, fields) {


            resolve(results)
            
        })
    

    })
}

//查询分类——文章

exports.type_page = (phid) => {
    return new Promise((resolve, reject) => {
        

        var sql1 = ''
        if (!phid) {
            sql1 = "select * from art_m"
        } else {
            sql1 = `select * from art_m where types='${phid}'`
        }



        connection.query(sql1, function (error, results, fields) {



            resolve(results)
           

        })

   
    })
}

//发送评论

exports.sendcomment = (req) => {
    return new Promise((resolve, reject) => {
       

        let sql1 = `insert into pinglun(content,p_id,name,email,page_id,ip,address) value('${req.pinglun}','${req.p_id}','${req.user}','${req.email}','${req.page_id}','${req.ip}','${req.address}')`;

        connection.query(sql1, function (error, results, fields) {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve('评论成功')
          


        })
  

    })
}


//展示评论


exports.showcomment = (page_id) => {
    return new Promise((resolve, reject) => {
       
        let sql1 = "select *,DATE_FORMAT(date, '%Y-%m-%d %h:%i %p') as date1 from pinglun where p_id=0 and page_id=" + page_id
        connection.query(sql1, function (error, results, fields) {

            resolve(results)
           
        })
    

    })
}

//展示评论2

exports.showcomment1 = (page_id) => {
    return new Promise((resolve, reject) => {
      
        let sql1 = "select *,DATE_FORMAT(date, '%Y-%m-%d %h:%i %p') as date1 from pinglun where page_id=" + page_id
        connection.query(sql1, function (error, results, fields) {


            resolve(results)
           
        })
  

    })
}