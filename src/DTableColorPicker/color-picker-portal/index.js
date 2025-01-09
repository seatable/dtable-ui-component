import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { throttle } from '../../utils/utils';

export default function ColorPickerPortal({ target, scrollContainerId, throttleDelay, children }) {

  const containerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!target || !containerRef.current) return;
    const updatePosition = () => {
      const targetRect = target.getBoundingClientRect();
      const { top: spaceAbove, left } = targetRect;
      const portalRectHeight = containerRef.current.clientHeight;
      if (spaceAbove < portalRectHeight) {
        setPosition({ top: `calc(${spaceAbove}px + 2.375rem)`, left: left + 1 + 'px' });
        return;
      }
      setPosition({ top: `calc(${spaceAbove - portalRectHeight}px)`, left: left + 1 + 'px' });
    };
    updatePosition();
    const throttledUpdatePosition = throttle(updatePosition, throttleDelay);
    const scrollContainer = scrollContainerId ? document.getElementById(scrollContainerId) : null;

    scrollContainer && scrollContainer.addEventListener('scroll', throttledUpdatePosition);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      scrollContainer && scrollContainer.removeEventListener('scroll', throttledUpdatePosition);
    };
  }, [target, containerRef, scrollContainerId, throttleDelay]);

  return ReactDOM.createPortal(
    <div
      className='dtable-color-picker-portal'
      style={{
        position: 'absolute',
        zIndex: '10',
        left: position.left,
        top: position.top,
        width: '240px',
        height: '370px'
      }}
      ref={containerRef}
    >
      {children}
    </div>,
    document.body
  );
}
