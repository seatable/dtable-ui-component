import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { processor } from '@seafile/seafile-editor';

import './index.css';

class HtmlLongTextFormatter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      innerHtml: null,
    };
  }

  componentDidMount() {
    this.translateValue(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = this.props;
    if (nextProps.value !== value) {
      this.translateValue(nextProps);
    }
  }

  translateValue = (props) => {
    const { value } = props;
    if (!value) {
      this.setState({ innerHtml: null });
      return;
    }
    const valueType = Object.prototype.toString.call(value);
    if (valueType === '[object String]') {
      this.convertMarkdown(value);
      return;
    }
    if (valueType === '[object Object]') {
      this.convertMarkdown(value.text);
      return;
    }
    return;
  };

  convertMarkdown = (mdFile) => {
    processor.process(mdFile).then((result) => {
      let innerHtml = String(result).replace(/<a /ig, '<a target="_blank" ');
      this.setState({ innerHtml });
    });
  };

  render() {
    const { innerHtml } = this.state;
    const { containerClassName } = this.props;
    const className= classnames('dtable-ui cell-formatter-container long-text-formatter', containerClassName);
    if (!innerHtml) return null;
    return (
      <div
        className={`${className} article`}
        dangerouslySetInnerHTML={{__html: innerHtml}}
      ></div>
    );
  }
}

HtmlLongTextFormatter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  containerClassName: PropTypes.string,
};

export default HtmlLongTextFormatter;
