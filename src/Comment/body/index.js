import React from 'react';
import { getLocale } from '../../lang';
import Comment from './comment';

import './index.css';

const Body = ({ comments, isFirstLoading, ...props }) => {
  if (comments.length === 0) {
    return (<div className="dtable-ui-comments-empty">{getLocale('No_comment_yet')}</div>);
  }

  return (
    <>
      {comments.map((comment, index) => {
        return (
          <Comment
            key={comment.id}
            { ...props }
            comment={comment}
            isScrollBottom={(index === comments.length - 1) && isFirstLoading}
          />
        );
      })}
    </>
  );
};

export default Body;
