import * as React from 'react';
import { createRoot } from 'react-dom/client';
import closest from '../utils/closest';
import Modal from './modal';

export default function alert(
  title,
  message,
  actions = [{ text: '确定' }],
  platform = 'ios'
) {
  let closed = false;

  if (!title && !message) {
    // console.log('Must specify either an alert title, or message, or both');
    return {
      close: () => { }
    };
  }

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

  const prefixCls = 'am-modal';

  function onWrapTouchStart(e) {
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, `.${prefixCls}-footer`);
    if (!pNode) {
      e.preventDefault();
    }
  }

  root.render(
    <Modal
      visible
      transparent
      title={title}
      transitionName="am-zoom"
      closable={false}
      maskClosable={false}
      footer={footer}
      maskTransitionName="am-fade"
      platform={platform}
      wrapProps={{ onTouchStart: onWrapTouchStart }}
    >
      <div className={`${prefixCls}-alert-content`}>{message}</div>
    </Modal>
  );

  return {
    close
  };
}
