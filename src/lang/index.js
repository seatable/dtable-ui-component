import de from '../locals/de';
import en from '../locals/en';
import fr from '../locals/fr';
import zh_CN from '../locals/zh-CN';

let langData = {
  'de': de,
  'en': en,
  'fr': fr,
  'zh-cn': zh_CN,
};

const LANGUAGE = 'en';

let LANGUAGE_MAP = {};

export function setLocale(args) {
  let lang = typeof args === 'string' ? args : LANGUAGE;
  LANGUAGE_MAP = langData[lang] || langData[LANGUAGE];
}

export function getLocale(key, def) {
  if (!key) return def;
  if (!LANGUAGE_MAP[key]) {
    return def || key;
  }
  return LANGUAGE_MAP[key];
}

export function substitute(str, obj) {
  if (typeof str === 'string') {
    if (str.indexOf('{') < 0) {
      return str;
    }

    return str.replace(/\\?\{([^{}]+)\}/g, (match, name) => {
      if (match.charAt(0) === '\\') {
        return match.slice(1);
      }
      return obj[name] === null || obj[name] === undefined ? '' : obj[name];
    });
  } else if (typeof str === 'function') {
    let val = str(obj);
    if (val === obj && typeof val === 'object') {
      val = Object.assign({}, obj);
    }
    return val;
  }

  return '';
}
