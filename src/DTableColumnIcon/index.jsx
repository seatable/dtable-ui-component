import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CellType, getColumnDisplayType, TEXT_DISPLAY_TYPE_MAP } from 'dtable-utils';
import DTableIcon from '../DTableIcon';

const COLUMNS_ICON_CONFIG = {
  [CellType.DEFAULT]: 'dtable-font dtable-icon-single-line-text',
  [CellType.TEXT]: 'dtable-font dtable-icon-single-line-text',
  [CellType.STRING]: 'dtable-font dtable-icon-single-line-text',
  [CellType.NUMBER]: 'dtable-font dtable-icon-number',
  [CellType.CHECKBOX]: 'dtable-font dtable-icon-check-square-solid',
  [CellType.DATE]: 'dtable-font dtable-icon-calendar-alt-solid',
  [CellType.SINGLE_SELECT]: 'dtable-font dtable-icon-single-election',
  [CellType.LONG_TEXT]: 'dtable-font dtable-icon-long-text',
  [CellType.IMAGE]: 'dtable-font dtable-icon-picture',
  [CellType.FILE]: 'dtable-font dtable-icon-file-alt-solid',
  [CellType.MULTIPLE_SELECT]: 'dtable-font dtable-icon-multiple-selection',
  [CellType.COLLABORATOR]: 'dtable-font dtable-icon-collaborator',
  [CellType.LINK]: 'dtable-font dtable-icon-link-other-record',
  [CellType.FORMULA]: 'dtable-font dtable-icon-formula',
  [CellType.LINK_FORMULA]: 'dtable-font dtable-icon-link-formulas',
  [CellType.CREATOR]: 'dtable-font dtable-icon-creator',
  [CellType.CTIME]: 'dtable-font dtable-icon-creation-time',
  [CellType.LAST_MODIFIER]: 'dtable-font dtable-icon-creator',
  [CellType.MTIME]: 'dtable-font dtable-icon-creation-time',
  [CellType.GEOLOCATION]: 'dtable-font dtable-icon-location',
  [CellType.AUTO_NUMBER]: 'dtable-font dtable-icon-autonumber',
  [CellType.URL]: 'dtable-font dtable-icon-url',
  [CellType.EMAIL]: 'dtable-font dtable-icon-email',
  [CellType.DURATION]: 'dtable-font dtable-icon-duration',
  [CellType.BUTTON]: 'dtable-font dtable-icon-button',
  [CellType.RATE]: 'dtable-font dtable-icon-rate',
  [CellType.DIGITAL_SIGN]: 'dtable-font dtable-icon-handwritten-signature',
  [CellType.DEPARTMENT_SINGLE_SELECT]: 'dtable-font dtable-icon-department-single-selection',
};

const COLUMN_DISPLAY_TYPE_ICON_CONFIG = {
  [CellType.TEXT]: {
    [TEXT_DISPLAY_TYPE_MAP.PHONE]: 'telephone',
  }
};

const DTableColumnIcon = ({ column, color, className, ariaHidden = false, getSvg }) => {
  const columnType = column?.type;
  if (!columnType) return null;
  const columnDisplayType = getColumnDisplayType(column);
  let symbol = null;
  let displayTypeIconConfig = COLUMN_DISPLAY_TYPE_ICON_CONFIG[columnType];
  if (displayTypeIconConfig && columnDisplayType) {
    symbol = displayTypeIconConfig[columnDisplayType];
  }
  if (!symbol) {
    symbol = COLUMNS_ICON_CONFIG[columnType];
  }

  return (
    <DTableIcon
      className={classnames('dtable-column-icon', className)}
      symbol={symbol}
      color={color}
      ariaHidden={ariaHidden}
      getSvg={getSvg}
    />
  );
};

DTableColumnIcon.propTypes = {
  column: PropTypes.object,
  color: PropTypes.string,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  getSvg: PropTypes.func,
};

export default DTableColumnIcon;
