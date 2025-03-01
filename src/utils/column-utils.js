import { DEFAULT_DATE_FORMAT } from 'dtable-utils';

export const isEnableCheckFormat = (column) => {
  if (!column) return false;
  const { data } = column;
  const { enable_check_format } = data || {};
  if (enable_check_format) return true;
  return false;
};

export const getDateColumnFormat = (column) => {
  const format = (column && column.data && column.data.format) ? column.data.format : DEFAULT_DATE_FORMAT;
  // Old Europe format is D/M/YYYY new format is DD/MM/YYYY
  return format;
};
