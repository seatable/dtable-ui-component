import * as React from 'react';
import { createRoot } from 'react-dom/client';
import closest from '../utils/closest';
import Modal from './modal';

export default function operation(
  actions = [{ text: '确定' }],
  platform = 'ios'
) {
  let closed = false;

  const prefixCls = 'am-modal';
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  function close() {
    if (div) {
      root.unmount();
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
    }
  }

  const footer = actions.map(button => {
    // tslint:disable-next-line:only-arrow-functions
    const orginPress = button.onPress || function () { };
    button.onPress = () => {
      if (closed) {
        return;
      }

      const res = orginPress();
      if (res && res.then) {
        res
          .then(() => {
            closed = true;
            close();
          })
          .catch(() => { });
      } else {
        closed = true;
        close();
      }
    };
    return button;
  });

  function onWrapTouchStart(e) {
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-footer');
    if (!pNode) {
      e.preventDefault();
    }
  }

  root.render(
    <Modal
      visible
      operation
      transparent
      prefixCls={prefixCls}
      transitionName="am-zoom"
      closable={false}
      maskClosable
      onClose={close}
      footer={footer}
      maskTransitionName="am-fade"
      className="am-modal-operation"
      platform={platform}
      wrapProps={{ onTouchStart: onWrapTouchStart }}
    />
  );

  return {
    close
  };
}
