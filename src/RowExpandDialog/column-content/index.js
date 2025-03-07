import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, UncontrolledTooltip } from 'reactstrap';
import { COLUMNS_ICON_CONFIG } from 'dtable-utils';

import './index.css';

const RowContent = ({ column, children }) => {
  const descriptionRef = useRef(null);
  const { name, type, key, description } = column;
  return (
    <Row className="dtable-ui-row-expand-column-content pb-4">
      <Col md={3} className="dtable-ui-row-expand-column-content-info d-flex">
        <span className="dtable-ui-header-icon" id={`header-icon-${key}`}>
          <i className={COLUMNS_ICON_CONFIG[type]}></i>
        </span>
        <span className="dtable-ui-row-expand-column-name">{name || ''}</span>
        {description &&
          <>
            <span
              className="dtable-font dtable-icon-description dtable-ui-column-tip-icon ml-2"
              ref={descriptionRef}
            >
            </span>
            {descriptionRef.current && (
              <UncontrolledTooltip
                innerClassName="dtable-ui-column-description-tip"
                popperClassName="dtable-ui-row-expand-column-tip"
                target={descriptionRef.current}
                placement="bottom"
                fade={false}
              >
                {description}
              </UncontrolledTooltip>
            )}
          </>
        }
      </Col>
      <Col md={9} className="d-flex align-items-center dtable-ui-row-expand-column-content-value">{children}</Col>
    </Row>
  );
};

RowContent.propTypes = {
  column: PropTypes.object,
  children: PropTypes.any,
};

export default RowContent;
