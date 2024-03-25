import React, { Component } from 'react';
import PropTypes from 'prop-types';
import reactElementToJSXString from 'react-element-to-jsx-string';
import classnames from 'classnames';

const propTypes = {
  children: PropTypes.any,
  title: PropTypes.string,
  sub: PropTypes.string,
};

const options = {
  showDefaultProps: false,
  showFunctions: true,
  maxInlineAttributesLineLength: 20
};

class ShowCode extends Component {

  state = {
    fold: true
  };

  renderJsxCode() {
    const { children } = this.props;

    let code = '';

    if(Array.isArray(children)) {
      children.forEach(el => {
        if (el.type.displayName === 'Description') {
          return;
        }
        code += reactElementToJSXString(el, {
          showDefaultProps: false
        });
        code += '\n';
      });
    } else {
      code += reactElementToJSXString(children, options);
    }

    return code;
  }

  handleCodeFold = () => {
    this.setState({fold: !this.state.fold});
  };

  render() {
    const { title, sub, children } = this.props;
    const { fold } = this.state;

    const codeClass = classnames('storybook-code-wrapper', {'storybook-code-wrapper-fold': fold});

    return (
      <div className='storybook-wrapper'>
        {<div className='storybook-code-btn' onClick={this.handleCodeFold}>{fold ? 'ShowCode' : 'hideCode'}</div>}
        {title && <p className='storybook-title'>{title}</p>}
        {sub && <p className='storybook-sub'>{sub}</p>}
        <div className='storybook-children'>{children}</div>
        {!fold && (
          <pre className={codeClass}>
            {this.renderJsxCode()}
          </pre>
        )}
      </div>
    );
  }
}

ShowCode.propTypes = propTypes;

export default ShowCode;
