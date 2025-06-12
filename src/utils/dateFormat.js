import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
export const currentTime = dayjs().format('HH:mm');
export const currentYear = dayjs().year();

export const DATE_FORMATS = {
  ISO: 'yyyy-mm-dd',
  ISOAndTime: 'yyyy-mm-dd hh:mm',
  US: 'm/d/yyyy',
  USAndTime: 'm/d/yyyy hh:mm',
  European: 'dd/mm/yyyy',
  EuropeanAndTime: 'dd/mm/yyyy hh:mm',
  Germany_Russia_etc: 'dd.mm.yyyy',
  Germany_Russia_etcAndTime: 'dd.mm.yyyy hh:mm',
};

export function fullValidYear(yearStr) {
  const year = yearStr;
  if (!year || isNaN(year)) return currentYear;
  if (year.length === 2) {
    if (Number(year) >= 0 && Number(year) < 69) {
      return year ? `20${year}` : currentYear;
    } else if (Number(year) >= 69 && Number(year) < 100) {
      return year ? `19${year}` : currentYear;
    }
  }
  if (year.length === 4) {
    return year;
  }
  return (year) ? year.padStart(4, '0') : currentYear;
}

export function formatDateLocal(formatStr, localeFormat) {
  const str = formatStr || '';
  const format = String(localeFormat).toLowerCase();
  let cleanStr;
  switch (format) {
    case DATE_FORMATS.ISO:
    case DATE_FORMATS.ISOAndTime:
      cleanStr = str.replace(/[^0-9]+/g, '-');
      return cleanStr.split('-').filter(Boolean).map(String);
    case DATE_FORMATS.US:
    case DATE_FORMATS.USAndTime:
    case DATE_FORMATS.European:
    case DATE_FORMATS.EuropeanAndTime:
      cleanStr = str.replace(/[^0-9]+/g, '/');
      return cleanStr.split('/').filter(Boolean).map(String);
    case DATE_FORMATS.Germany_Russia_etc:
    case DATE_FORMATS.Germany_Russia_etcAndTime:
      cleanStr = str.replace(/[^0-9]+/g, '.');
      return cleanStr.split('.').filter(Boolean).map(String);
    default:
      return [];
  }
}

export function delimate(localeFormat) {
  const formatPrefix = String(localeFormat).toLowerCase();
  let delimiter;
  if (formatPrefix === DATE_FORMATS.Germany_Russia_etc ||
        formatPrefix === DATE_FORMATS.Germany_Russia_etcAndTime) {
    delimiter = '.';
  } else if (formatPrefix === DATE_FORMATS.ISO || formatPrefix === DATE_FORMATS.ISOAndTime) {
    delimiter = '-';
  } else {
    delimiter = '/';
  }
  return delimiter;
}

export function renderDisplayContent(str, localeFormat, delimiter) {
  const format = String(localeFormat).toLowerCase();
  const parts = formatDateLocal(str, localeFormat);
  if (parts.length < 3) {
    return '';
  }
  let day = parts[2];
  let month = parts[1];
  let year = String(fullValidYear(parts[0])).padStart(4, '0');
  let time = `${parts[3]}:${parts[4]}` || currentTime;
  if (format === DATE_FORMATS.ISO) {
    return `${year}${delimiter}${month}${delimiter}${day}`;
  }
  if (format === DATE_FORMATS.ISOAndTime) {
    return `${year}${delimiter}${month}${delimiter}${day} ${time}`;
  }
  if (format === DATE_FORMATS.US) {
    return `${Number(month)}${delimiter}${Number(day)}${delimiter}${year}`;
  }
  if (format === DATE_FORMATS.USAndTime) {
    return `${Number(month)}${delimiter}${Number(day)}${delimiter}${year} ${time}`;
  }
  if (format === DATE_FORMATS.European ||
    format === DATE_FORMATS.Germany_Russia_etc) {
    return `${Number(day)}${delimiter}${Number(month)}${delimiter}${year}`;
  }
  if (format === DATE_FORMATS.EuropeanAndTime ||
    format === DATE_FORMATS.Germany_Russia_etcAndTime) {
    return `${Number(day)}${delimiter}${Number(month)}${delimiter}${year} ${time}`;
  }
}

export function renderFilterInputFormat(str, localeFormat, delimiter){
  const format = String(localeFormat).toLowerCase();
  const parts = formatDateLocal(str, localeFormat);
  if (parts.length < 3) {
    return '';
  }
  let day;
  let month;
  let year;
  let time = `${parts[3]}:${parts[4]}` || currentTime;
  if (format === DATE_FORMATS.ISO) {
    day = parts[2];
    month = parts[1];
    year = String(fullValidYear(parts[0])).padStart(4, '0');
    return `${year}${delimiter}${month}${delimiter}${day}`;
  }
  if (format === DATE_FORMATS.ISOAndTime) {
    day = parts[2];
    month = parts[1];
    year = String(fullValidYear(parts[0])).padStart(4, '0');
    return `${year}${delimiter}${month}${delimiter}${day} ${time}`;
  }
  if (format === DATE_FORMATS.US) {
    day = parts[1];
    month = parts[0];
    year = String(fullValidYear(parts[2])).padStart(4, '0');
    return `${Number(month)}${delimiter}${Number(day)}${delimiter}${year}`;
  }
  if (format === DATE_FORMATS.USAndTime) {
    day = parts[1];
    month = parts[0];
    year = String(fullValidYear(parts[2])).padStart(4, '0');
    return `${Number(month)}${delimiter}${Number(day)}${delimiter}${year} ${time}`;
  }
  if (format === DATE_FORMATS.European ||
    format === DATE_FORMATS.Germany_Russia_etc) {
    day = parts[0];
    month = parts[1];
    year = String(fullValidYear(parts[2])).padStart(4, '0');
    return `${Number(day)}${delimiter}${Number(month)}${delimiter}${year}`;
  }
  if (format === DATE_FORMATS.EuropeanAndTime ||
    format === DATE_FORMATS.Germany_Russia_etcAndTime) {
    day = parts[0];
    month = parts[1];
    year = String(fullValidYear(parts[2])).padStart(4, '0');
    return `${Number(day)}${delimiter}${Number(month)}${delimiter}${year} ${time}`;
  }
}


export function filterChangeValue(str, localeFormat){
  const format = String(localeFormat).toLowerCase();
  const parts = formatDateLocal(str, format);
  if (parts.length < 3) {
    return '';
  }
  let day;
  let month;
  let year;
  if (format === DATE_FORMATS.ISO || format === DATE_FORMATS.ISOAndTime) {
    day = parts[2];
    month = parts[1];
    year = fullValidYear(parts[0]);
  }
  if (format === DATE_FORMATS.US || format === DATE_FORMATS.USAndTime) {
    day = parts[1];
    month = parts[0];
    year = fullValidYear(parts[2]);
  }
  if (format === DATE_FORMATS.European ||
    format === DATE_FORMATS.Germany_Russia_etc ||
    format === DATE_FORMATS.EuropeanAndTime ||
    format === DATE_FORMATS.Germany_Russia_etcAndTime) {
    day = parts[0];
    month = parts[1];
    year = fullValidYear(parts[2]);
  }
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function getDay(str, localeFormat, mode) {
  const format = String(localeFormat).toLowerCase();
  const parts = formatDateLocal(str, format);
  if (parts.length < 3) {
    return '';
  }
  if (!mode){
    if (format === DATE_FORMATS.ISO || format === DATE_FORMATS.ISOAndTime) {
      return String(parts[2]).padStart(2, '0');
    }
    return String(Number(parts[2]));
  }
  if (format === DATE_FORMATS.ISO || format === DATE_FORMATS.ISOAndTime) {
    return String(parts[2]).padStart(2, '0');
  }
  if (format === DATE_FORMATS.US || format === DATE_FORMATS.USAndTime) {
    return String(Number(parts[1]));
  }
  return String(Number(parts[0]));
}

export function getMonth(str, localeFormat, mode) {
  const format = String(localeFormat).toLowerCase();
  const parts = formatDateLocal(str, format);
  if (parts.length < 3) {
    return '';
  }
  if (!mode){
    if (format === DATE_FORMATS.ISO || format === DATE_FORMATS.ISOAndTime) {
      return String(Number(parts[1]) - 1).padStart(2, '0');
    }
    return String(Number(parts[1]) - 1);
  }
  if (format === DATE_FORMATS.ISO || format === DATE_FORMATS.ISOAndTime) {
    return String(Number(parts[1]) - 1).padStart(2, '0');
  }
  if (format === DATE_FORMATS.US || format === DATE_FORMATS.USAndTime) {
    return String(Number(parts[0]) - 1);
  }
  return String(Number(parts[1]) - 1);
}

export function getYear(str, localeFormat, mode) {
  const format = String(localeFormat).toLowerCase();
  const parts = formatDateLocal(str, format);
  if (parts.length < 3) {
    return '';
  }
  if (!mode){
    return String(fullValidYear(parts[0])).padStart(4, '0');
  }
  if (format === DATE_FORMATS.ISO || format === DATE_FORMATS.ISOAndTime) {
    return String(fullValidYear(parts[0])).padStart(4, '0');
  }
  return String(fullValidYear(parts[2])).padStart(4, '0');
}
