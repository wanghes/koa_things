const crypto = require('crypto');
const config = require('./index');

const encryptoSha1 = (pass) =>{
	const sha1 = crypto.createHash('sha1');
	sha1.update(pass);
	return sha1.digest('hex')
}

// 创建对称加密 加密算法
const aesEncode = (data, key = config.encryptoKey) => {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
// 创建对称加密 解密算法
const aesDecode = (encrypted, key = config.encryptoKey) => {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');
const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');

// 加密
function genSign(src) {
    let sign = '';
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    sign += cipher.update(src, 'utf8', 'hex');
    sign += cipher.final('hex');
    return sign;
}

// 解密
function deSign(sign) {
    let src = '';
    const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    src += cipher.update(sign, 'hex', 'utf8');
    src += cipher.final('utf8');
    return src;
}

module.exports = {
    encryptoSha1,
    aesEncode,
    aesDecode,
    genSign,
    deSign
}
// var data = 'Hello, this is a secret message!';
// var key = 'Password!';
// var encrypted = aesEncrypt(data, key);
// var decrypted = aesDecrypt(encrypted, key);

// console.log('Plain text: ' + data);
// console.log('Encrypted text: ' + encrypted);
// console.log('Decrypted text: ' + decrypted);
