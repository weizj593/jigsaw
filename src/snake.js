import CryptoJS from 'crypto-js'

const aesKey = CryptoJS.enc.Utf8.parse('ejf45EsshFni7gkj')
const salt = 'eeee'

function fnImgSrcQs (req = { w: 0, h: 0, x: 0, y: 0 }) {
  // console.log('fnImgSrcQs ', req)
  // return `https://picsum.photos/id/${getRandomNumberByRange(0,
  //   1084)}/${req.w}/${req.h}`
  req.k = localStorage.getItem('s_k')
  let ver = 1
  let ts = new Date().getTime()
  let data = req//{ x: req.x, y: req.y, k: k }
  let content = salt + encrypt(data)
  let sig = sign(content, ver, ts)
  let q = qs(content, ver, ts, sig)
  return q
}

function fnVerifyQs (req = {
  spliced: true,
  verified: true,
  left: 0
}) {
  // console.log('fnVerifyQs ', req)
  req.k = localStorage.getItem('s_k')
  let ver = 1
  let ts = new Date().getTime()
  let data = req; //{ left: req.left,spliced:req.spliced,verified:req.verified, k: k }
  let content = salt + encrypt(data)
  let sig = sign(content, ver, ts)
  let q = qs(content, ver, ts, sig)
  //return 'http://localhost:8088/recMan/slideVerifyImg' + q
  return q
}

function sign (content, ver, ts) {
  return CryptoJS.MD5(content + salt + '&' + ver + ts).toString()
}

function encrypt (data = {}) {
  let content = salt + JSON.stringify(data)
  let rs = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(content), aesKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).ciphertext.toString()
  // console.log(rs)
  return rs
}

function qs (content, ver, ts, sig) {
  return '?s=' + content + '&v=' + ver + '&t=' + ts +
    '&_=' + sig
}

function getRandomNumberByRange (start, end) {
  return Math.round(Math.random() * (end - start) + start)
}

export default {
  fnImgSrcQs: fnImgSrcQs,
  fnVerifyQs: fnVerifyQs,
}
