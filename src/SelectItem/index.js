import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const SelectItem = ({ option, fontSize, className, isShowRemove, onRemove }) => {

  const style = useMemo(() => {
    return {
      display: 'flex',
      alignItems: 'center',
      padding: '0px 10px',
      marginRight: 8,
      height: 20,
      lineHeight: '20px',
      textAlign: 'center',
      borderRadius: 10,
      width: 'min-content',
      maxWidth: 300,
      margin: '5px 10px 5px 0',
      fontSize: fontSize || 13,
      backgroundColor: option.color,
      color: option.textColor || null,
    };
  }, [option, fontSize]);

  const opBtnStyle = useMemo(() => {
    const textColor = option.textColor || null;
    return {
      cursor: 'pointer',
      color: textColor === '#FFFFFF' ? '#FFFFFF' : '#909090',
      marginLeft: 5,
    };
  }, [option]);

  return (
    <div className={classnames('dtable-ui dtable-ui-select-item', className)} style={style}>
      <div className="dtable-ui-select-item-name text-truncate" title={option.name}>{option.name}</div>
      {isShowRemove && (
        <div className="dtable-ui-select-item-operation-btn" style={opBtnStyle} onClick={onRemove}>
          <i className="dtable-font dtable-icon-fork-number" style={{ fontSize: '12px', transform: 'scale(0.8)', display: 'inline-block', lineHeight: '12px' }}></i>
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
