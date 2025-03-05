const zhCN = require('@seafile/seafile-calendar/lib/locale/zh_CN');
const zhTW = require('@seafile/seafile-calendar/lib/locale/zh_TW');
const enUS = require('@seafile/seafile-calendar/lib/locale/en_US');
const frFR = require('@seafile/seafile-calendar/lib/locale/fr_FR');
const deDE = require('@seafile/seafile-calendar/lib/locale/de_DE');
const esES = require('@seafile/seafile-calendar/lib/locale/es_ES');
const plPL = require('@seafile/seafile-calendar/lib/locale/pl_PL');
const ptBR = require('@seafile/seafile-calendar/lib/locale/pt_BR');
const csCZ = require('@seafile/seafile-calendar/lib/locale/cs_CZ');
const ruRU = require('@seafile/seafile-calendar/lib/locale/ru_RU');

export const initDateEditorLanguage = (lang) => {
  let language;
  switch (lang) {
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
    case 'pt-br':
      language = ptBR;
      break;
    case 'cs':
      language = csCZ;
      break;
    case 'ru':
      language = ruRU;
      break;
    default:
      language = zhCN;
  }
  return language;
};

export const getSelectOptionItem = (options, optionId) => {
  return options.find(option => option.id === optionId);
};

export const getTrimmedString = (value) => {
  return (typeof value === 'string') ? value.trim() : '';
};
