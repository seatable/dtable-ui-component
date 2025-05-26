/* tslint:disable:jsx-no-multiline-js */
import classnames from 'classnames';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Dialog from 'rmc-dialog';
import TouchFeedback from 'rmc-feedback';
import getDataAttr from '../_util/getDataAttr';
import Badge from '../Badge';

import './style/index.css';

const NORMAL = 'NORMAL';
const SHARE = 'SHARE';
// tslint:disable-next-line:no-empty
function noop() { }
const queue = [];

function createActionSheet(flag, config, callback) {
  const props = {
    prefixCls: 'am-action-sheet',
    cancelButtonText: '取消',
    ...config
  };
  const {
    prefixCls,
    className,
    transitionName,
    maskTransitionName,
    maskClosable = true
  } = props;

  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = createRoot(div);

  queue.push(close);

  function close() {
    if (div) {
      root.unmount();
      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }
      const index = queue.indexOf(close);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    }
  }

  function cb(index, rowIndex = 0) {
    const res = callback(index, rowIndex);
    if (res && res.then) {
      res.then(() => {
        close();
      });
    } else {
      close();
    }
  }

  const {
    title,
    message,
    options,
    destructiveButtonIndex,
    cancelButtonIndex,
    cancelButtonText,
    badges = []
  } = props;
  const titleMsg = [
    title ? (
      <h3 key="0" className={`${prefixCls}-title`}>
        {title}
      </h3>
    ) : null,
    message ? (
      <div key="1" className={`${prefixCls}-message`}>
        {message}
      </div>
    ) : null
  ];
  let children = null;
  let mode = 'normal';
  switch (flag) {
    case NORMAL:
      mode = 'normal';
      const normalOptions = options;
      const badgesMap = {};
      if (badges && badges.length > 0) {
        badges.forEach(element => {
          if (element.index >= 0) {
            badgesMap[element.index] = <Badge {...element} />;
          }
        });
      }
      children = (
        <div {...getDataAttr(props)}>
          {titleMsg}
          <div className={`${prefixCls}-button-list`} role="group">
            {normalOptions.map((item, index) => {
              const itemProps = {
                className: classnames(`${prefixCls}-button-list-item`, {
                  [`${prefixCls}-destructive-button`]:
                    destructiveButtonIndex === index,
                  [`${prefixCls}-cancel-button`]: cancelButtonIndex === index
                }),
                onClick: () => cb(index),
                role: 'button'
              };
              let bContent = <div {...itemProps}>{item}</div>;
              // 仅在设置徽标的情况下修改dom结构
              if (badgesMap[index]) {
                bContent = (
                  <div
                    {...itemProps}
                    className={`${itemProps.className} ${prefixCls}-button-list-badge`}
                  >
                    <span className={`${prefixCls}-button-list-item-content`}>
                      {item}
                    </span>
                    {badgesMap[index]}
                  </div>
                );
              }
              let bItem = (
                <TouchFeedback
                  key={index}
                  activeClassName={`${prefixCls}-button-list-item-active`}
                >
                  {bContent}
                </TouchFeedback>
              );
              if (
                cancelButtonIndex === index ||
                destructiveButtonIndex === index
              ) {
                bItem = (
                  <TouchFeedback
                    key={index}
                    activeClassName={`${prefixCls}-button-list-item-active`}
                  >
                    <div {...itemProps}>
                      {item}
                      {cancelButtonIndex === index ? (
                        <span className={`${prefixCls}-cancel-button-mask`} />
                      ) : null}
                    </div>
                  </TouchFeedback>
                );
              }
              return bItem;
            })}
          </div>
        </div>
      );
      break;
    case SHARE:
      mode = 'share';
      const multipleLine =
        (options.length && Array.isArray(options[0])) || false;
      const createList = (item, index, rowIndex = 0) => (
        <div
          className={`${prefixCls}-share-list-item`}
          role="button"
          key={index}
          onClick={() => cb(index, rowIndex)}
        >
          <div className={`${prefixCls}-share-list-item-icon`}>{item.icon}</div>
          <div className={`${prefixCls}-share-list-item-title`}>
            {item.title}
          </div>
        </div>
      );
      children = (
        <div {...getDataAttr(props)}>
          {titleMsg}
          <div className={`${prefixCls}-share`}>
            {multipleLine ? (
              options.map((item, index) => (
                <div key={index} className={`${prefixCls}-share-list`}>
                  {item.map((ii, ind) => createList(ii, ind, index))}
                </div>
              ))
            ) : (
              <div className={`${prefixCls}-share-list`}>
                {options.map((item, index) => createList(item, index))}
              </div>
            )}
            <TouchFeedback
              activeClassName={`${prefixCls}-share-cancel-button-active`}
            >
              <div
                className={`${prefixCls}-share-cancel-button`}
                role="button"
                onClick={() => cb(-1)}
              >
                {cancelButtonText}
              </div>
            </TouchFeedback>
          </div>
        </div>
      );
      break;
    default:
      break;
  }

  const rootCls = classnames(`${prefixCls}-${mode}`, className);
  root.render(
    <Dialog
      visible
      title=""
      footer=""
      prefixCls={prefixCls}
      className={rootCls}
      transitionName={transitionName || 'am-slide-up'}
      maskTransitionName={maskTransitionName || 'am-fade'}
      onClose={() => cb(cancelButtonIndex || -1)}
      maskClosable={maskClosable}
      wrapProps={props.wrapProps || {}}
    >
      {children}
    </Dialog>
  );

  return {
    close
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  showActionSheetWithOptions(config, callback = noop) {
    createActionSheet(NORMAL, config, callback);
  },
  showShareActionSheetWithOptions(config, callback = noop) {
    createActionSheet(SHARE, config, callback);
  },
  close() {
    queue.forEach(q => q());
  }
};
