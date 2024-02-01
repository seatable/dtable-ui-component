import { useEffect } from 'react';

export const useClickOutside = ({ currDOM, onClickOutside }, deps) => {
  useEffect(() => {
    const onMousedown = (event) => {
      if (currDOM && event && currDOM.contains(event.target)) {
        return;
      }
      onClickOutside && onClickOutside(event);
    };
    document.addEventListener('mousedown', onMousedown);
    return () => {
      document.removeEventListener('mousedown', onMousedown);
    };

  // eslint-disable-next-line
  }, deps || []);
};
