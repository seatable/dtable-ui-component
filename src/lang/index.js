import de from '../locales/de.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import pt from '../locales/pt.json';
import ru from '../locales/ru.json';
import es from '../locales/es.json';
import zh_CN from '../locales/zh-CN.json';

const zhCN = require('@seafile/seafile-calendar/lib/locale/zh_CN');
const zhTW = require('@seafile/seafile-calendar/lib/locale/zh_TW');
const enUS = require('@seafile/seafile-calendar/lib/locale/en_US');
const frFR = require('@seafile/seafile-calendar/lib/locale/fr_FR');
const deDE = require('@seafile/seafile-calendar/lib/locale/de_DE');
const esES = require('@seafile/seafile-calendar/lib/locale/es_ES');
const plPL = require('@seafile/seafile-calendar/lib/locale/pl_PL');
const csCZ = require('@seafile/seafile-calendar/lib/locale/cs_CZ');
const ruRU = require('@seafile/seafile-calendar/lib/locale/ru_RU');

let langData = {
  'de': de,
  'en': en,
  'fr': fr,
  'pt': pt,
  'ru': ru,
  'es': es,
  'zh-cn': zh_CN,
};

let LANGUAGE = 'en';

let LANGUAGE_MAP = langData[LANGUAGE];

export function setLocale(args) {
  LANGUAGE = typeof args === 'string' ? args : LANGUAGE;
  LANGUAGE_MAP = langData[LANGUAGE];
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

export function getLocale(key, obj = {}) {
  if (!key) return '';
  let str = LANGUAGE_MAP[key];
  if (!str) return key;
  const paramKeys = Object.keys(obj);
  if (paramKeys.length === 0) return str;
  return substitute(str, obj);
}

export function translateCalendar() {
  const locale = LANGUAGE ? LANGUAGE : 'en';
  let language;
  switch (locale) {
    case 'zh-cn':
      language = zhCN;
      break;
    case 'zh-tw':
      language = zhTW;
      break;
    case 'en':
      language = enUS;
      break;
    case 'fr':
      language = frFR;
      break;
    case 'de':
      language = deDE;
      break;
    case 'es':
      language = esES;
      break;
    case 'es-ar':
      language = esES;
      break;
    case 'es-mx':
      language = esES;
      break;
    case 'pl':
      language = plPL;
      break;
    case 'cs':
      language = csCZ;
      break;
    case 'ru':
      language = ruRU;
      break;
    default:
      language = enUS;
  }
  return language;
}

export function getMobileDatePickerLocale() {
  return {
    DatePickerLocale: {
      year: getLocale('Year'),
      month: getLocale('Month'),
      day: getLocale('Day'),
      hour: getLocale('Hour'),
      minute: getLocale('Minute'),
    },
    okText: getLocale('Done'),
    dismissText: getLocale('Cancel')
  };
}

export {
  LANGUAGE,
};
