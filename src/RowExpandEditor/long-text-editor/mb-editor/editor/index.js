import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getPreviewContent } from '@seafile/seafile-editor';
import TextareaItem from '../../../../TextareaItem';
import MobileFullScreenPage from '../../../../MobileFullScreenPage';
import { getLocale } from '../../../../lang';

import './index.css';

const { Header, Body } = MobileFullScreenPage;

const Editor = ({ value: oldValue, title, onToggle, onChange }) => {
  const [value, setValue] = useState(oldValue || '');
  const hasUnSaved = useRef(false);

  const rowCounts = useMemo(() => document.body.offsetWidth < 768 ? 10 : 20, []);

  const handleTextChange = useCallback((newValue) => {
    if (value === newValue) return;
    setValue(newValue);
    hasUnSaved.current = true;
  }, [value]);

  const onSave = useCallback(() => {
    if (!hasUnSaved.current) return;
    const { previewText, images, links, checklist } = getPreviewContent(value);
    const newValue = Object.assign({}, { text: value, preview: previewText, images: images, links: links, checklist });
    onChange && onChange(newValue);
    hasUnSaved.current = false;
  }, [value, onChange]);

  const handleSave = useCallback(() => {
    onSave();
    onToggle();
  }, [onSave, onToggle]);

  return (
    <MobileFullScreenPage className="dtable-ui-mobile-long-text-editor" onClose={onToggle}>
      <Header onLeftClick={onToggle} onRightClick={handleSave}>
        <>{getLocale('Close')}</>
        <>{title}</>
        <span style={{ color: '#f09f3f' }}>{getLocale('Submit')}</span>
      </Header>
      <Body>
        <div className="dtable-ui-mobile-long-text-editor-container">
          <TextareaItem rows={rowCounts} value={value} onChange={handleTextChange} />
        </div>
      </Body>
    </MobileFullScreenPage>
  );
};

Editor.propTypes = {
  value: PropTypes.string,
  title: PropTypes.any,
  onToggle: PropTypes.func,
  onChange: PropTypes.func,
};

export default Editor;
