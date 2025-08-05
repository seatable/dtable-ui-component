import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { throttle } from '../../utils/utils';

export default function ColorPickerPortal({ target, scrollContainerId, throttleDelay = 16, children }) {
  const containerRef = useRef(null);
  const [isPositioned, setIsPositioned] = useState(false);
  const [position, setPosition] = useState(() => {
    return { top: '-9999px', left: '-9999px', visibility: 'hidden' };
  });

  const updatePosition = useCallback(() => {
    if (!target || !containerRef.current) return;

    const targetRect = target.getBoundingClientRect();
    const { top: spaceAbove, left } = targetRect;
    const portalRectHeight = containerRef.current.clientHeight;

    const newPosition = {
      left: `${left + 1}px`,
      visibility: 'visible',
    };

    if (spaceAbove < portalRectHeight) {
      newPosition.top = `calc(${spaceAbove}px + 2.375rem)`;
    } else {
      newPosition.top = `calc(${spaceAbove - portalRectHeight}px)`;
    }

    setPosition(prev => ({
      ...prev,
      ...newPosition
    }));

    if (!isPositioned) {
      setIsPositioned(true);
    }
  }, [target, isPositioned]);

  useEffect(() => {
    if (!target) return;

    const initialPosition = () => {
      updatePosition();
      requestAnimationFrame(updatePosition);
    };
    const timer = setTimeout(initialPosition, 0);

    const throttledUpdatePosition = throttle(updatePosition, throttleDelay);
    const scrollContainer = scrollContainerId ? document.getElementById(scrollContainerId) : null;

    scrollContainer?.addEventListener('scroll', throttledUpdatePosition, { passive: true });
    window.addEventListener('resize', throttledUpdatePosition, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', throttledUpdatePosition);
      scrollContainer?.removeEventListener('scroll', throttledUpdatePosition);
    };
  }, [target, scrollContainerId, throttleDelay, updatePosition]);

  if (!target) return null;

  return ReactDOM.createPortal(
    <div
      className='dtable-color-picker-portal'
      style={{
        position: 'fixed',
        zIndex: '1049',
        left: position.left,
        top: position.top,
        width: '240px',
        height: '370px',
        visibility: position.visibility,
        opacity: isPositioned ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
      }}
      ref={containerRef}
    >
      {children}
    </div>,
    document.body
  );
}
