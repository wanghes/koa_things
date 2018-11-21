const redis = require('redis');
const encrypto = require('../config/encrypto.js');
const jwt = require('jsonwebtoken');
const { aesEncode,aesDecode } = encrypto;
const config = require('../config/index.js');
const dbModel =  require('../db/index.js')
const moment = require('moment');

let booklist = [
	{id:1,title:"book1",author:"wang1"},
	{id:2,title:"book2",author:"wang2"},
	{id:3,title:"book3",author:"wang3"},
	{id:4,title:"book4",author:"wang4"},
	{id:5,title:"WebView与服务器端的Js交互",author:"冰封传情"},
	{id:6,title:"WebView的使用（http协议访问网络Get和Post请求方式）",author:"杨天福"},
	{id:7,title:"以刮骨疗毒勇气重建 ",author:"毒勇气"},
	{id:8,title:"以刮骨疗毒勇气重建",author:"毒勇气"},
	{id:9,title:"以刮骨疗毒勇气重建 ",author:"毒勇气"},
	{id:10,title:"以刮骨疗毒勇气重建 ",author:"毒勇气"},
	{id:11,title:"以刮骨疗毒勇气重建 ",author:"毒勇气"},
	{id:12,title:"以刮骨疗毒勇气重建 ",author:"毒勇气"},
	{id:13,title:"以刮骨疗毒勇气重建 ",author:"毒勇气"},
	{id:14,title:"以刮骨疗毒勇气重建 ",author:"毒勇气"}
];

/*
const client = redis.createClient({
	host:"localhost",
	port:6379
});


client.on("connect",() =>{
	client.hmset("ad",{'js':1},(err,res) =>{
		console.log(res)
	})
	client.hmget("ad",['js'],(err,books) =>{
		let values = new Set([1,2,3,1,4,3,6,7,5])
		console.log(Array.from(values));
		console.log(books);
	})
	let listJSON = JSON.stringify(booklist);

	client.set("booklist",listJSON,(err,res) =>{
		if(err){
			console.log(err)
		}else{
			console.log(res)
		}

	})
	client.get("booklist",(err,res) =>{
		if(err){
			return err;
		}
		console.log(res)
	})
});

*/
const redirect = ctx => {
  ctx.response.redirect('/');
};

const main = ctx => {
  ctx.response.body = "首页"
};


const sleep = (time) =>{
	return new Promise((resolve,resject) =>{
		setTimeout(() =>{
			resolve();
		},time)
	})
}



const auth = async (ctx,next) =>{
	if(ctx.request.path=="/insertUser"){ //便于插入数据
		await next();
		return;
	}
	if(ctx.request.path=="/doLogin"){
		await next();
	}else{
		if (!ctx.state.user) {
			ctx.response.status = 401;
			ctx.response.body = "请先登录"
		}else{
			await next();
		}
	}
}

const getToken = (name,password,id) =>{
	return new Promise((resolve,reject) =>{
		let data = { name, password, id };
		jwt.sign(data, config.tokenSecret,  { expiresIn: 60 * 60 }, (err, token) => { //登录token设置1一个小时过期时间
			if(err) {
				reject(err);
			}else{
				resolve(token);
			}
		});
	})

}

const doLogin = async (ctx) =>{
	let name = ctx.request.body.name;
	let password = ctx.request.body.password;
	let user = await dbModel.findDataByName(name);

	if (user.length > 0) {
		user = user.pop();
		let db_pass = aesDecode(user.pass)
		if(db_pass == password){
			let token = await getToken(name,password,user.id)
			ctx.response.body = {
		  		code:1,
		  		token,
		  		user,
		  		msg:"登录成功！"
		  	};
		}else{
			ctx.response.body = {
		  		code:0,
		  		msg:"密码不正确！"
		  	};
		}
	}else{
		ctx.response.body = {
			code:2,
			msg:"用户不存在,登录失败！"
		};
	}

}

const insertUser = async (ctx) =>{
	let name = ctx.request.body.name;
	let user = await dbModel.findDataByName(name);
	if(user.length>0){
		return ctx.response.body = {
			code:0,
			message:"对不住，用户已经存在了，从新注册一个！"
		};
	}
	let password = aesEncode(ctx.request.body.password);
	let result = await dbModel.insertUser([name,password]);
	if(result.insertId && result.affectedRows==1){
		ctx.response.body = {
			code:1,
			message:"注册用户成功"
		}
	}else{
		ctx.response.body = {
			code:0,
			message:"注册用户失败"
		}
	}
}


const books = async ctx =>{
	await sleep(1000);
	ctx.response.body = booklist;
}

const articles = async ctx =>{
	let result = await dbModel.findAllPost();
    console.log(result);
	if(result){
		ctx.response.body = {code:1,data:result};
	}
}

const getArticle = async (ctx,id) =>{
	let query = await dbModel.findDataById(id);
	await sleep(1000);
	if(query){
		if(Array.isArray(query)){
			query = query.pop();
		}
		ctx.response.body = { code:1,data:query};
	}else{
		ctx.response.body = { code:0,message:"结果获取失败"};
	}
}

const AddArticle = async ctx =>{
	let data = [
		"王大海",
		ctx.request.body.title,
		ctx.request.body.content,
		10,
		moment().format("YYYY-MM-DD hh:mm:ss")
	]

	let result = await dbModel.insertPost(data);
	if(result){
		if(result.insertId){
			ctx.response.body = {
				code:1,
				data:result.insertId
			}
		}
	}
}

const updateArticle = async (ctx) =>{
	let data = ctx.request.body
	let { id,title,content } = data

	let uData = await dbModel.updatePost([title,content,id])
	if(uData){
		ctx.response.body = { code:1,data:uData }
	}else{
		ctx.response.body = { code:0,message:"更新失败" }
	}
}

const deleteArticle = async (ctx,id) =>{
	let affectedRows = 0;
	let deleteInfo = await dbModel.deletePost(id)
	if(deleteInfo){
		affectedRows = deleteInfo.affectedRows
	}
	if(affectedRows){
		ctx.response.body = {code:1,data:affectedRows}
	}else{
		ctx.response.body = {code:0,message:"error"}
	}
}

const bookDetail = async (ctx,id) =>{
	await sleep(1);
	if(ctx.request.query.type!="detail"){
		ctx.throw(400,'type error',{ user: "wawwaw" });
	}
	let value = booklist.filter((item) =>{
		return item.id == id
	})
	ctx.response.body = value[0];
}

module.exports = {
	main,
	redirect,
	auth,
	doLogin,
	insertUser,
	books,
	bookDetail,
	articles,
	AddArticle,
	getArticle,
	updateArticle,
	deleteArticle
}
