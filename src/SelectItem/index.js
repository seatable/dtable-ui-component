import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './index.css';

const SelectItem = ({ option, fontSize, className, isShowRemove, onRemove }) => {

  const selectItemStyle = useMemo(() => {
    return {
      fontSize: fontSize || 13,
      backgroundColor: option.color,
      color: option.textColor || null,
    };
  }, [option, fontSize]);

  const removeBtnStyle = useMemo(() => {
    const textColor = option.textColor || null;
    return {
      color: textColor === '#FFFFFF' ? '#FFFFFF' : '#909090',
    };
  }, [option]);

  return (
    <div className={classnames('dtable-ui dtable-ui-select-item', className)} style={selectItemStyle}>
      <div className="dtable-ui-select-item-name text-truncate" title={option.name}>{option.name}</div>
      {isShowRemove && (
        <div className="dtable-ui-select-item-remove-btn" style={removeBtnStyle} onClick={onRemove}>
          <i className="dtable-font dtable-icon-fork-number"></i>
        </div>
      )}
    </div>
  );
};

SelectItem.propTypes = {
  option: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  fontSize: PropTypes.number,
  isShowRemove: PropTypes.bool,
  onRemove: PropTypes.func,
};

export default SelectItem;
