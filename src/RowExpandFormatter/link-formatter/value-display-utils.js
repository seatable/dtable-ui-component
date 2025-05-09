import {
  CellType,
  getCellValueDisplayString,
} from 'dtable-utils';

const DOWNLOAD_NAME_COLUMN_TYPES = [
  CellType.TEXT,
  CellType.NUMBER,
  CellType.DATE,
  CellType.COLLABORATOR,
  CellType.CREATOR,
  CellType.AUTO_NUMBER
];

export const getCellDisplayValue = (record, column, collaborators) => {
  if (!column || !DOWNLOAD_NAME_COLUMN_TYPES.includes(column.type)) return '';
  const { key, type, data } = column;
  return getCellValueDisplayString(record, type, key, { data, collaborators, geolocationHyphen: ' ' });
};
