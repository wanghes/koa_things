// const convert = require('koa-convert');
// const staticCache = require('koa-static-cache');
//静态文件服务
// app.use(convert(staticCache(path.join(__dirname, './'), {
//     maxAge: 365 * 24 * 60 * 60
// })));
//app.use(koajwt({ secret: 'shhhhhh', debug: true }).unless({ path: ['/doLogin']}));
const Koa = require("koa");
const route = require('koa-route');
const cors = require('koa-cors');
const moment = require('moment');
const koajwt  = require('koa-jwt');
const compress = require('koa-compress');
const koaBody = require('koa-body');
const path = require('path');
const config = require('./config/index.js');
const app = new Koa();
const router = require("./controller/index.js");

app.use(cors());
app.use(koaBody({
    textLimit: 10000
}));

app.use(koajwt({
    secret: config.tokenSecret,
    debug: true,
    passthrough:true
}).unless({ path: ['/articles']}));

app.use(router.auth)
app.use(route.post('/main', router.main));
app.use(route.post('/doLogin', router.doLogin));
app.use(route.post('/insertUser', router.insertUser));
app.use(route.get('/articles',	router.articles));
app.use(route.get('/list',	router.list));
app.use(route.get('/getArticle/:id', router.getArticle));
app.use(route.post('/addArticle', router.AddArticle));
app.use(route.post('/updateArticle', router.updateArticle));
app.use(route.delete('/deleteArticle/:id', router.deleteArticle));
// app.use(compress()); //对资源文件进行压缩

//app.listen(3000, "0.0.0.0")
app.listen(3000);
