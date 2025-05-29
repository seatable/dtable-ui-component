import classnames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { addClass, removeClass } from '../utils/class';
import { canUseDOM } from '../utils/exenv';
import CustomKeyboard from './custom-keyboard';
import Portal from './portal';

let customNumberKeyboard = null;
const IS_REACT_16 = !!ReactDOM.createPortal;

function getBodyScrollTop() {
  const el = document.scrollingElement || document.documentElement;
  return (el && el.scrollTop) || 0;
}
function setBodyScrollTop(scrollTop) {
  const el = document.scrollingElement || document.documentElement;
  el.scrollTop = scrollTop;
}

class NumberInput extends React.Component {
  static defaultProps = {
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    onVirtualKeyboardConfirm: () => {},
    placeholder: '',
    disabled: false,
    editable: true,
    prefixCls: 'am-input',
    keyboardPrefixCls: 'am-number-keyboard',
    autoAdjustHeight: false
  };

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      value: props.value || ''
    };
  }

  onChange = value => {
    if (!('value' in this.props)) {
      this.setState({ value: value.target.value });
    }
    this.props.onChange(value);
  };

  onConfirm = value => {
    this.props.onVirtualKeyboardConfirm(value);
  };

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  addBlurListener = () => {
    document.addEventListener('touchend', this.doBlur, false);
  };

  removeBlurListener = () => {
    document.removeEventListener('touchend', this.doBlur, false);
  };

  componentWillUnmount() {
    // focus:true unmount 不能触发 blur
    if (this.state.focus) {
      this.props.onBlur(this.state.value);
    }
    this.unLinkInput();
  }

  saveRef = el => {
    if (IS_REACT_16 && el) {
      customNumberKeyboard = el;
    }
  };

  getComponent() {
    const {
      confirmLabel,
      backspaceLabel,
      cancelKeyboardLabel,
      keyboardPrefixCls,
      moneyKeyboardWrapProps,
      moneyKeyboardHeader,
      disabledKeys
    } = this.props;
    return (
      <CustomKeyboard
        ref={this.saveRef}
        onClick={this.onKeyboardClick}
        prefixCls={keyboardPrefixCls}
        confirmLabel={confirmLabel}
        backspaceLabel={backspaceLabel}
        cancelKeyboardLabel={cancelKeyboardLabel}
        wrapProps={moneyKeyboardWrapProps}
        header={moneyKeyboardHeader}
        disabledKeys={disabledKeys}
      />
    );
  }

  getContainer() {
    const { keyboardPrefixCls } = this.props;
    let container = document.querySelector(`#${keyboardPrefixCls}-container`);
    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', `${keyboardPrefixCls}-container`);
      document.body.appendChild(container);
    }
    this.container = container;
    return this.container;
  }

  renderCustomKeyboard() {
    if (IS_REACT_16) {
      this.keyBoard = (
        <Portal getContainer={() => this.getContainer()}>
          {this.getComponent()}
        </Portal>
      );
    } else {
      customNumberKeyboard = ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        this.getComponent(),
        this.getContainer()
      );
    }
  }

  doBlur = ev => {
    const { value } = this.state;
    if (ev.target !== this.inputRef) {
      this.onInputBlur(value);
    }
  };

  unLinkInput = () => {
    if (
      customNumberKeyboard &&
      customNumberKeyboard.antmKeyboard &&
      customNumberKeyboard.linkedInput &&
      customNumberKeyboard.linkedInput === this
    ) {
      customNumberKeyboard.linkedInput = null;
      if (this.props.autoAdjustHeight) {
        this.getContainer().style.height = '0';
      }
      addClass(
        customNumberKeyboard.antmKeyboard,
        `${this.props.keyboardPrefixCls}-wrapper-hide`
      );
    }
    // for unmount
    this.removeBlurListener();
  };

  onInputBlur = value => {
    if (IS_REACT_16) {
      this.keyBoard = null;
    }
    const { focus } = this.state;
    if (focus) {
      this.setState({
        focus: false
      });
      this.props.onBlur(value);
      setTimeout(() => {
        this.unLinkInput();
      }, 50);
    }
  };

  onInputFocus = () => {
    const { value } = this.state;
    this.props.onFocus(value);
    this.setState(
      {
        focus: true
      },
      () => {
        if (customNumberKeyboard) {
          customNumberKeyboard.linkedInput = this;
          if (customNumberKeyboard.antmKeyboard) {
            if (this.props.autoAdjustHeight) {
              const keyBoardHeight =
                customNumberKeyboard.antmKeyboard.offsetHeight;
              this.getContainer().style.height = `${keyBoardHeight}px`;
              if (this.inputRef) {
                const { bottom } = this.inputRef.getBoundingClientRect();
                const clientHeight = window.innerHeight;
                // 计算输入框距离视窗的底部距离
                const distance = clientHeight - bottom;
                if (distance < keyBoardHeight) {
                  setBodyScrollTop(
                    getBodyScrollTop() + keyBoardHeight - distance
                  );
                }
              }
            }
            removeClass(
              customNumberKeyboard.antmKeyboard,
              `${this.props.keyboardPrefixCls}-wrapper-hide`
            );
          }
          customNumberKeyboard.confirmDisabled = value === '';
          if (customNumberKeyboard.confirmKeyboardItem) {
            if (value === '') {
              addClass(
                customNumberKeyboard.confirmKeyboardItem,
                `${this.props.keyboardPrefixCls}-item-disabled`
              );
            } else {
              removeClass(
                customNumberKeyboard.confirmKeyboardItem,
                `${this.props.keyboardPrefixCls}-item-disabled`
              );
            }
          }
        }
      }
    );
  };

  onKeyboardClick = KeyboardItemValue => {
    const { maxLength } = this.props;
    const { value } = this.state;
    // tslint:disable-next-line:no-this-assignment
    const { onChange } = this;

    let valueAfterChange;
    // 删除键
    if (KeyboardItemValue === 'delete') {
      valueAfterChange = value.substring(0, value.length - 1);
      onChange({ target: { value: valueAfterChange } });
      // 确认键
    } else if (KeyboardItemValue === 'confirm') {
      valueAfterChange = value;
      onChange({ target: { value: valueAfterChange } });
      this.onInputBlur(value);
      this.onConfirm(value);
      // 收起键
    } else if (KeyboardItemValue === 'hide') {
      valueAfterChange = value;
      this.onInputBlur(valueAfterChange);
    } else {
      if (
        maxLength !== undefined &&
        +maxLength >= 0 &&
        (value + KeyboardItemValue).length > maxLength
      ) {
        valueAfterChange = (value + KeyboardItemValue).substr(0, maxLength);
        onChange({ target: { value: valueAfterChange } });
      } else {
        valueAfterChange = value + KeyboardItemValue;
        onChange({ target: { value: valueAfterChange } });
      }
    }
    if (customNumberKeyboard) {
      customNumberKeyboard.confirmDisabled = valueAfterChange === '';
      if (customNumberKeyboard.confirmKeyboardItem) {
        if (valueAfterChange === '') {
          addClass(
            customNumberKeyboard.confirmKeyboardItem,
            `${this.props.keyboardPrefixCls}-item-disabled`
          );
        } else {
          removeClass(
            customNumberKeyboard.confirmKeyboardItem,
            `${this.props.keyboardPrefixCls}-item-disabled`
          );
        }
      }
    }
  };

  onFakeInputClick = () => {
    this.focus();
  };

  focus = () => {
    // this focus may invocked by users page button click, so this click may trigger blurEventListener at the same time
    this.renderCustomKeyboard();
    this.removeBlurListener();
    const { focus } = this.state;
    if (!focus) {
      this.onInputFocus();
    }
    setTimeout(() => {
      this.addBlurListener();
    }, 50);
  };

  renderPortal() {
    if (!IS_REACT_16 || !canUseDOM) {
      return null;
    }

    return this.keyBoard;
  }

  render() {
    const { placeholder, disabled, editable, moneyKeyboardAlign } = this.props;
    const { focus, value } = this.state;
    const preventKeyboard = disabled || !editable;
    const fakeInputCls = classnames('fake-input', {
      focus,
      'fake-input-disabled': disabled
    });
    const fakeInputContainerCls = classnames('fake-input-container', {
      'fake-input-container-left': moneyKeyboardAlign === 'left'
    });

    return (
      <div className={fakeInputContainerCls}>
        {value === '' && (
          // tslint:disable-next-line:jsx-no-multiline-js
          <div className="fake-input-placeholder">{placeholder}</div>
        )}
        <div
          role="textbox"
          aria-label={value || placeholder}
          className={fakeInputCls}
          ref={el => (this.inputRef = el)}
          onClick={preventKeyboard ? () => {} : this.onFakeInputClick}
        >
          {value}
        </div>
        {this.renderPortal()}
      </div>
    );
  }
}

export default NumberInput;
