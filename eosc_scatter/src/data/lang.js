import cookie from 'js-cookie'
import cn_lang from '../data/cn.js'
import en_lang from '../data/en.js'
import kr_lang from '../data/kr.js'

const langs = [{'key': 'cn', 'text': '中文'}, {'key': 'en', 'text': 'English'}, {'key': 'kr', 'text': '한국어'}];
const key_lang = {
    cn: cn_lang,
    en: en_lang,
    kr: kr_lang
}
export const check_lang_key = () => {
    let url_lang = window.location.href.match(/#\/(.*)/);
    url_lang = url_lang ? url_lang[1].split('/')[0] : url_lang;
    let lang_key = url_lang || (cookie.get('lang') || 'cn');
    lang_key = langs.find(item => item.key == lang_key) ? lang_key : 'cn';
    langs.find(item => item.key == lang_key).selected = true;
    return lang_key;
}
let lang_key = check_lang_key();
cookie.set('lang', lang_key);
const now_lang = {
    now_lang: langs.find(item => item.key == lang_key),
    exchange_lang: langs.find(item => item.key != lang_key),
    data: key_lang[lang_key],
    langs
}
export const set_lang = (key, fn) => {
    cookie.set('lang', key);
    if(fn && typeof fn == 'function'){
        fn();
    }
}
export const lang = now_lang