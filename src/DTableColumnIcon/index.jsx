import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CellType, getColumnDisplayType, TEXT_DISPLAY_TYPE_MAP } from 'dtable-utils';

import DTableIcon from '../DTableIcon';

const COLUMNS_ICON_CONFIG = {
  [CellType.DEFAULT]: 'text',
  [CellType.TEXT]: 'text',
  [CellType.STRING]: 'text',
  [CellType.NUMBER]: 'number',
  [CellType.CHECKBOX]: 'checkbox',
  [CellType.DATE]: 'date',
  [CellType.SINGLE_SELECT]: 'single-select',
  [CellType.LONG_TEXT]: 'long-text',
  [CellType.IMAGE]: 'image',
  [CellType.FILE]: 'files',
  [CellType.MULTIPLE_SELECT]: 'multiple-select',
  [CellType.COLLABORATOR]: 'group',
  [CellType.LINK]: 'link-to-other-records',
  [CellType.FORMULA]: 'formula',
  [CellType.LINK_FORMULA]: 'link-formula',
  [CellType.CREATOR]: 'user',
  [CellType.CTIME]: 'date-time',
  [CellType.LAST_MODIFIER]: 'user',
  [CellType.MTIME]: 'date-time',
  [CellType.GEOLOCATION]: 'geolocation',
  [CellType.AUTO_NUMBER]: 'auto-number',
  [CellType.URL]: 'url',
  [CellType.EMAIL]: 'email',
  [CellType.DURATION]: 'duration',
  [CellType.BUTTON]: 'button',
  [CellType.RATE]: 'starred',
  [CellType.DIGITAL_SIGN]: 'digital-signature',
  [CellType.DEPARTMENT_SINGLE_SELECT]: 'department-single-select',
};

const DTableColumnIcon = forwardRef(({ column, color, style, className, ariaHidden = false, isSyncColumn = false, getSvg, ...props }, ref) => {
  const columnType = column?.type;
  if (!columnType || !Object.prototype.hasOwnProperty.call(COLUMNS_ICON_CONFIG, columnType)) return null;
  let symbol = COLUMNS_ICON_CONFIG[columnType];
  if (columnType === CellType.TEXT && getColumnDisplayType(column) === TEXT_DISPLAY_TYPE_MAP.PHONE) {
    symbol = 'phone-number';
  }
  if (isSyncColumn) {
    symbol = `${symbol}-sync`;
  }
  return (
    <DTableIcon
      ref={ref}
      symbol={symbol}
      className={classnames('dtable-column-icon', className)}
      color={color}
      style={style}
      ariaHidden={ariaHidden}
      getSvg={getSvg}
      {...props}
    />
  );
});

DTableColumnIcon.displayName = 'DTableColumnIcon';

DTableColumnIcon.propTypes = {
  column: PropTypes.object,
  color: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  ariaHidden: PropTypes.bool,
  getSvg: PropTypes.func,
  isSyncColumn: PropTypes.bool,
};

export default DTableColumnIcon;
