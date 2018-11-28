const redis = require('redis');
const encrypto = require('../config/encrypto.js');
const jwt = require('jsonwebtoken');
const { aesEncode,aesDecode } = encrypto;
const config = require('../config/index.js');
const dbModel =  require('../db/index.js')
const moment = require('moment');


const sleep = (time) =>{
	return new Promise((resolve,resject) => {
		setTimeout(() =>{
			resolve();
		},time)
	})
}


const main = async ctx => {
	ctx.response.body = { code: 1, data: 'ok' };
}

const auth = async (ctx, next) => {
	if(ctx.request.path == "/insertUser" || ctx.request.path == "/articles" || ctx.request.path == "/main"){ //便于插入数据
		await next();
		return;
	}

	if (ctx.url.match(/^\/getArticle/)) {
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

const getToken = (name, password, id) =>{
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
	if (user.length>0) {
		return ctx.response.body = {
			code:0,
			message:"对不住，用户已经存在了，从新注册一个！"
		};
	}
	let password = aesEncode(ctx.request.body.password);
	let result = await dbModel.insertUser([name, password]);
	if (result.insertId && result.affectedRows == 1) {
		ctx.response.body = {
			code: 1,
			message: "注册用户成功"
		}
	} else {
		ctx.response.body = {
			code: 0,
			message: "注册用户失败"
		}
	}
}

const list = async ctx => {
	const uid = ctx.state.user.id;
	let result = await dbModel.findDataByUser(uid);
	if (result) {
		ctx.response.body = { code: 1, data: result };
	}
}

const articles = async ctx => {
	let result = await dbModel.findAllPost();
	if (result) {
		ctx.response.body = { code: 1, data:result };
	}
}

const getArticle = async (ctx, id) =>{
	let query = await dbModel.findDataById(id);

	if (query) {
		if (Array.isArray(query)) {
			query = query.pop();
		}
		ctx.response.body = { code: 1, data: query};
	} else {
		ctx.response.body = { code: 0, message: "结果获取失败" };
	}
}

const AddArticle = async ctx => {
	const uid = ctx.state.user.id;
	let data = [
		ctx.request.body.title,
		ctx.request.body.content,
		uid,
		moment().format("YYYY-MM-DD hh:mm:ss")
	];

	let result = await dbModel.insertPost(data);
	if (result) {
		if (result.insertId) {
			ctx.response.body = {
				code: 1,
				data: result.insertId
			}
		}
	}
}

const updateArticle = async (ctx) => {
	let data = ctx.request.body
	let { id, title, content } = data

	let uData = await dbModel.updatePost([title,content,id])
	if (uData) {
		ctx.response.body = { code: 1, data: uData }
	} else {
		ctx.response.body = { code: 0, message: "更新失败" }
	}
}

const deleteArticle = async (ctx, id) => {
	let affectedRows = 0;
	let deleteInfo = await dbModel.deletePost(id);

	if (deleteInfo) {
		affectedRows = deleteInfo.affectedRows;
	}
	if (affectedRows) {
		ctx.response.body = { code: 1, data: affectedRows }
	} else {
		ctx.response.body = { code: 0, message: "删除错误" }
	}
}


module.exports = {
	auth,
	doLogin,
	main,
	insertUser,
	list,
	articles,
	AddArticle,
	getArticle,
	updateArticle,
	deleteArticle
}
