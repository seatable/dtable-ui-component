import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getPreviewContent } from '@seafile/seafile-editor';
import LongTextPreview from './widgets/LongTextPreview';
import ModalPortal from '../ModalPortal';

import './index.css';

class SimpleLongTextFormatter extends React.Component {

  static defaultProps = {
    value: {
      text: '',
      images: [],
      links: [],
      preview: '',
    },
  };

  constructor(props) {
    super(props);
    this.formatterStyle = null;
    this.state = {
      isPreview: false
    };
  }

  componentWillUnmount() {
    this.clearOpenPreviewTimer();
    this.clearClosePreviewTimer();
  }

  renderLinks = (value) => {
    const links = value.links;
    if (!Array.isArray(links) || links.length === 0) return null;
    return (
      <span className="long-text-links">
        <i className="dtable-font dtable-icon-url"></i>
        {links.length}
      </span>
    );
  };

  renderCheckList = (value) => {
    const checkList = value.checklist;
    if (!checkList || checkList.total === 0) return null;
    return (
      <span className="long-text-check-list">
        <i className={`dtable-font dtable-icon-check-square-solid ${checkList.completed === checkList.total ? 'long-text-check-list-completed' : ''}`}></i>
        {`${checkList.completed}/${checkList.total}`}
      </span>
    );
  };

  renderImages = (value) => {
    const images = value.images;
    if (!Array.isArray(images) || images.length === 0) return null;
    return (
      <span className="long-text-images">
        <img src={images[0]} alt=""/>
        <i className="image-number">{images.length > 1 ? '+' + images.length : null}</i>
      </span>
    );
  };

  renderContent = (value) => {
    return (<span className="long-text-content">{value.preview}</span>);
  };

  translateValue = () => {
    const { value } = this.props;
    if (!value) return {};
    const valueType = Object.prototype.toString.call(value);
    if (valueType === '[object String]') {
      const { previewText, images, links, checklist } = getPreviewContent(value);
      const newValue = Object.assign({}, { text: value, preview: previewText, images, links, checklist });
      return newValue;
    }
    if (valueType === '[object Object]') {
      return value;
    }
    return {};
  };

  clearOpenPreviewTimer = () => {
    if (!this.openPreviewTimer) return;
    clearTimeout(this.openPreviewTimer);
    this.openPreviewTimer = null;
  };

  clearClosePreviewTimer = () => {
    if (!this.closePreviewTimer) return;
    clearTimeout(this.closePreviewTimer);
    this.closePreviewTimer = null;
  };

  onMouseEnter = () => {

    // in case that there is no `modal-wrapper`
    if (!document.getElementById('modal-wrapper')) return;

    this.clearOpenPreviewTimer();
    if (this.props.value) {
      this.openPreviewTimer = setTimeout(() => {
        const style = this.ref.getBoundingClientRect();
        this.formatterStyle = style;
        this.setState({ isPreview: true });
      }, 2000);
    }
  };

  onMouseLeave = () => {
    this.clearOpenPreviewTimer();

    // Case 1: The mouse moves out of the cell and is not in the preview component, close the preview component after 2S
    this.closePreviewTimer = setTimeout(() => {
      if (this.state.isPreview) {
        this.setState({ isPreview: false });
      }
    }, 2000);
  };

  // Case 2: The mouse moves out of the cell and into the preview component, do not close the preview component
  onPreviewMouseEnter = () => {
    this.clearClosePreviewTimer();
  };

  // Case 2: The mouse move out of the preview component, close the preview component
  onPreviewMouseLeave = () => {
    if (this.state.isPreview) {
      this.setState({ isPreview: false });
    }
  };

  render() {
    const { isPreview } = this.state;
    const { containerClassName, previewClassName } = this.props;
    const className = classnames('dtable-ui cell-formatter-container long-text-formatter', containerClassName);
    const value = this.translateValue();
    return (
      <div
        className={className}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        ref={ref => this.ref = ref}
      >
        {this.renderLinks(value)}
        {this.renderCheckList(value)}
        {this.renderImages(value)}
        {this.renderContent(value)}
        {isPreview &&
          <ModalPortal>
            <LongTextPreview
              className={previewClassName}
              value={value}
              formatterStyle={this.formatterStyle}
              onMouseEnter={this.onPreviewMouseEnter}
              onMouseLeave={this.onPreviewMouseLeave}
            />
          </ModalPortal>
        }
      </div>
    );
  }
}

SimpleLongTextFormatter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  containerClassName: PropTypes.string,
  previewClassName: PropTypes.string,
};

export default SimpleLongTextFormatter;
