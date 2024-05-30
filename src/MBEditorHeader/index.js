import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  title: PropTypes.string,
  titleClass: PropTypes.string,
  leftContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  rightContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
};

class MBEditorHeader extends React.Component {

  render() {
    let { title, titleClass, leftContent, rightContent, onLeftClick, onRightClick } = this.props;
    return (
      <div className={`dtable-ui-mb-editor-header ${titleClass ? titleClass : ''}`}>
        <span className="editor-header-left-content" onClick={onLeftClick}>{leftContent}</span>
        <span className="editor-header-title">{title}</span>
        <span className="editor-header-right-content" onClick={onRightClick} style={{ color: '#f09f3f' }}>{rightContent}</span>
      </div>
    );
  }
}

MBEditorHeader.propTypes = propTypes;

export default MBEditorHeader;
