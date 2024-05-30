import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  option: PropTypes.object.isRequired,
  isShowRemoveIcon: PropTypes.bool,
  onDeleteLinkOption: PropTypes.func,
};

class LinkEditorOption extends React.Component {

  static defaultProps = {
    isShowRemoveIcon: false
  };

  onDeleteOption = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
    this.props.onDeleteLinkOption(this.props.option);
  };

  getContainerStyle = () => {
    return {
      display: 'inline-flex',
      marginRight: '10px',
      padding: '0px 5px',
      height: '20px',
      borderRadius: '2px',
      fontSize: '13px',
      background: '#eceff4',
      cursor: 'pointer'
    };
  };

  getOptionStyle = () => {
    return {
      flex: 1,
      display: 'flex',
      alignContent: 'center',
      margin: '0 4px 0 2px',
    };
  };

  getOptionNameStyle = () => {
    return {
      maxWidth: '230px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    };
  };

  getOperationStyle = () => {
    return {
      height: '20px',
      width: '16px',
      cursor: 'pointer',
      color: '#909090',
      transform: 'scale(.8)',
    };
  };

  render() {
    let { option, isShowRemoveIcon } = this.props;
    let containerStyle = this.getContainerStyle();
    let optionStyle = this.getOptionStyle();
    let optionNameStyle = this.getOptionNameStyle();
    let operationStyle = this.getOperationStyle();

    return (
      <div className="dtable-ui link-option-item" style={containerStyle}>
        <div className="option-info" style={optionStyle}>
          <div className="option-name" style={optionNameStyle} title={option.name}>{option.name}</div>
        </div>
        {isShowRemoveIcon && (
          <div className="option-remove" style={operationStyle} onClick={this.onDeleteOption}>
            <i className="dtable-font dtable-icon-fork-number" style={{ fontSize: '12px', lineHeight: '20px' }}></i>
          </div>
        )}
      </div>
    );
  }
}

LinkEditorOption.propTypes = propTypes;

export default LinkEditorOption;
