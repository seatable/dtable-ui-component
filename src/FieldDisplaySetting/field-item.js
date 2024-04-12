import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { COLUMNS_ICON_CONFIG } from 'dtable-utils';
import DTableSwitch from '../DTableSwitch';

const propTypes = {
  field: PropTypes.object.isRequired,
  isCollapsed: PropTypes.bool,
  onClickField: PropTypes.func.isRequired,
  onMoveField: PropTypes.func.isRequired,
};

function FieldItem({ field, isCollapsed, onClickField, onMoveField }) {
  let enteredCounter = 0;
  const fieldItemRef = useRef(null);
  const [isItemDropTipShow, setDropTipShow] = useState(false);

  const handleClickField = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    const value = e.target.checked;
    if (value === field.shown) return;
    onClickField(field.key, value);
  };

  const onDragStart = (e) => {
    e.stopPropagation();
    e.dataTransfer.setDragImage(fieldItemRef.current, 10, 10);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', field.key);
  };

  const onTableDragEnter = (e) => {
    e.stopPropagation();
    enteredCounter++;
    if (enteredCounter !== 0 && !isItemDropTipShow) {
      setDropTipShow(true);
    }
  };

  const onDragOver = (e) => {
    if (e.dataTransfer.dropEffect === 'copy') {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDragLeave = (e) => {
    e.stopPropagation();
    enteredCounter--;
    if (enteredCounter === 0) {
      setDropTipShow(false);
    }
  };

  const onDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setDropTipShow(false);
    const droppedColumnKey = e.dataTransfer.getData('text/plain');
    if (droppedColumnKey === field.key) return;
    onMoveField(droppedColumnKey, field.key);
  };

  const placeholder = () => {
    return (
      <div className="field-switch">
        <i className={`dtable-font ${COLUMNS_ICON_CONFIG[field.type]}`} />
        <span>{field.name}</span>
      </div>
    );
  };

  return (
    <div
      ref={fieldItemRef}
      className={`field-item-container ${isCollapsed ? 'd-none' : ''}`}
      onDrop={onDrop}
      onDragEnter={onTableDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="field-dragbar" draggable="true" onDragStart={onDragStart}>
        <i className="dtable-font dtable-icon-drag pr-2" />
      </div>
      <DTableSwitch
        checked={field.shown}
        switchClassName="flex-fill"
        placeholder={placeholder()}
        onChange={handleClickField}
      />
    </div>
  );
}

FieldItem.propTypes = propTypes;

export default FieldItem;
