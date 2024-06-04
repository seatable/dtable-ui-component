import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Label } from 'reactstrap';
import { Transition } from 'react-transition-group';
import FieldItem from './field-item';

import './index.css';

const propTypes = {
  fields: PropTypes.array.isRequired,
  textProperties: PropTypes.object.isRequired,
  fieldAllShown: PropTypes.bool.isRequired,
  onClickField: PropTypes.func.isRequired,
  onMoveField: PropTypes.func.isRequired,
  onToggleFieldsVisibility: PropTypes.func.isRequired,
};

const FIELD_ITEM_HEIGHT = 30;
const BANNER_HEIGHT = 24;
const DURATION = 300;

function FieldDisplaySetting({ fields, textProperties, fieldAllShown, onClickField, onMoveField, onToggleFieldsVisibility }) {
  const nodeRef = useRef(null);
  const [isCollapsed, setCollapsed] = useState(true);

  const expandAllFields = () => {
    setCollapsed(!isCollapsed);
  };

  const defaultStyle = {
    transition: `all ${DURATION}ms cubic-bezier(.645,.045,.355,1)`,
    opacity: 0,
  };
  const transitionStyles = {
    entering: { opacity: 1, height: `${fields.length * FIELD_ITEM_HEIGHT + BANNER_HEIGHT}px` },
    entered: { opacity: 1, height: `${fields.length * FIELD_ITEM_HEIGHT + BANNER_HEIGHT}px` },
    exiting: { opacity: 0, height: 0 },
    exited: { opacity: 0, height: 0 },
  };

  return (
    <div className="field-setting">
      <div className="field-setting-header d-flex align-items-center justify-content-between" onClick={expandAllFields} >
        <Label className="mb-0">{textProperties.titleValue}</Label>
        <span className={`dtable-font dtable-icon-right expand-button ${isCollapsed ? '' : 'revolving'}`} />
      </div>
      <Transition nodeRef={nodeRef} in={!isCollapsed} timeout={DURATION}>
        {state => (
          <div className="field-setting-wrapper" ref={nodeRef} style={{ ...defaultStyle, ...transitionStyles[state] }}>
            <div className={`field-setting-banner ${isCollapsed ? 'd-none' : 'd-flex'} align-items-center justify-content-between h-5 mt-2 mb-2`}>
              <Label className="mb-0">{textProperties.bannerValue}</Label>
              <span className="show-all-button" onClick={onToggleFieldsVisibility}>
                {fieldAllShown ? textProperties.hideValue : textProperties.showValue}
              </span>
            </div>
            <div className="field-setting-body">
              {fields.map((field, index) => {
                return (
                  <FieldItem
                    key={`${field.key}-${index}`}
                    field={field}
                    isCollapsed={isCollapsed}
                    onClickField={onClickField}
                    onMoveField={onMoveField}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
}

FieldDisplaySetting.propTypes = propTypes;

export default FieldDisplaySetting;
