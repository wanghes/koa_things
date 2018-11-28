const mysql = require('mysql')
const config = require("../config/index.js")
let pool = mysql.createPool({...config.database});

let query = (sql,values=null) =>{
	return new Promise((resolve,reject) =>{
		pool.getConnection((err,connection) =>{
			if(err){
				resolve(err)
			}else{
                // console.log(sql, values)
                if (values) {
    				connection.query(sql,values,(err,rows) => {
    					if(err){
                            // console.log(err)
    						reject(err)
    					}else{
                            // console.log(rows)
    						resolve(rows)
    					}
    					connection.release()
    				})
                } else {
                    connection.query(sql,(err,rows) => {
                        if(err){
                            // console.log(err)
                            reject(err)
                        }else{
                            // console.log(rows)
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
			}
		})
	})
}

const users= `create table if not exists users(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(100) NOT NULL,
 pass VARCHAR(40) NOT NULL,
 PRIMARY KEY ( id )
);`
const posts=`create table if not exists posts(
 id INT NOT NULL AUTO_INCREMENT,
 title VARCHAR(40) NOT NULL,
 content  VARCHAR(40) NOT NULL,
 uid  VARCHAR(40) NOT NULL,
 moment  VARCHAR(40) NOT NULL,
 PRIMARY KEY ( id )
);`



const createTable = ( sql ) => {
  return query( sql, [] )
}

// 注册用户
let insertUser = value => {
    let _sql = "insert into users(name, pass) values(?,?);"
    return query( _sql, value )
}

// 发表文章 使用方法 dbModel.insertPost([name,title,content,id,time])
let insertPost = value => {
    let _sql = "insert into posts(title,content,uid,moment) values(?,?,?,?);"
    return query( _sql, value )
}

// 通过名字查找用户
let findDataByName = name =>{
    let _sql = `SELECT * from users where name="${name}"`
    return query( _sql)
}
// 通过文章的名字查找用户
let findDataByUser = uid => {
    let _sql = `SELECT * from posts where uid="${uid}" order by id desc`
    return query( _sql)
}
// 通过文章id查找
let findDataById = id => {
    let _sql = `SELECT * from posts where id="${id}"`
    return query( _sql)
}

// 查询所有文章
let findOnePost = () => {
    let _sql = `SELECT * FROM posts order by id desc limit 1`
    return query( _sql)
}

// 查询所有文章
let findAllPost = () => {
    let _sql = `SELECT title,id FROM posts order by id desc`
    return query( _sql)
}

// 更新修改文章
let updatePost = (values) => {
    let _sql=`update posts set title=?,content=? where id=?`
    return query(_sql,values)
}
// 删除文章
let deletePost = (id) => {
    let _sql=`delete from posts where id = ${id}`
    return query(_sql)
}


module.exports = {
    query,
    createTable,
    insertUser,
    findDataByName,
    insertPost,
    findAllPost,
    findDataByUser,
    findDataById,
    updatePost,
    deletePost
}
