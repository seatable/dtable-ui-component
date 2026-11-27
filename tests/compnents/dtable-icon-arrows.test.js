import fs from 'fs';
import path from 'path';
import { fireEvent, render } from '@testing-library/react';
import CollapsibleSettingLayout from '../../src/CollapsibleSettingLayout';
import FieldDisplaySetting from '../../src/FieldDisplaySetting';
import RightAngle from '../../src/RowExpandEditor/right-angle';

jest.mock('../../src/DTableIcon/svg-icon', () => {
  const React = require('react');
  const classnames = require('classnames');
  return {
    __esModule: true,
    default: ({ className, symbol, color, style, ariaHidden, focusable }) => (
      <svg
        data-symbol={symbol}
        className={classnames('multicolor-icon', className, `multicolor-icon-${symbol}`)}
        style={{ ...style, ...(color ? { color } : {}) }}
        aria-hidden={ariaHidden || undefined}
        focusable={focusable}
      />
    ),
  };
});

const DTableIcon = require('../../src/DTableIcon').default;

describe('dtable-ui-component arrow SVG migration', () => {
  it.each(['arrow-down-b', 'arrow-right-b', 'arrow-right'])(
    'ships %s.svg with currentColor fill',
    (symbol) => {
      const filePath = path.resolve(__dirname, `../../src/assets/icons/${symbol}.svg`);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).toContain('<svg');
      expect(content).toContain('fill="currentColor"');
    }
  );

  it('forwards style and color through DTableIcon for both SVG and font fallback icons', () => {
    const { container, rerender } = render(
      <DTableIcon
        symbol="arrow-down-b"
        color="rgb(18, 52, 86)"
        style={{ fontSize: '12px', marginLeft: '-2px' }}
        ariaHidden
      />
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveClass('multicolor-icon', 'multicolor-icon-arrow-down-b');
    expect(svg.style.fontSize).toBe('12px');
    expect(svg.style.marginLeft).toBe('-2px');
    expect(svg.style.color).toBe('rgb(18, 52, 86)');

    rerender(
      <DTableIcon
        symbol="dtable-icon-copy"
        color="rgb(18, 52, 86)"
        style={{ fontSize: '12px' }}
        ariaHidden
      />
    );
    const fontIcon = container.querySelector('i');
    expect(fontIcon).not.toBeNull();
    expect(fontIcon.style.fontSize).toBe('12px');
    expect(fontIcon.style.color).toBe('rgb(18, 52, 86)');
  });

  it('renders arrow-right-b SVG in CollapsibleSettingLayout and toggles spin class', () => {
    const { container } = render(
      <CollapsibleSettingLayout title="Settings">
        <div>Body</div>
      </CollapsibleSettingLayout>
    );
    const header = container.querySelector('.collapsible-setting-layout-header');
    const svg = header.querySelector('svg[data-symbol="arrow-right-b"]');
    expect(svg).not.toBeNull();
    expect(svg).toHaveClass('dtable-icon-spin');

    fireEvent.click(header);
    expect(header.querySelector('svg[data-symbol="arrow-right-b"]')).not.toHaveClass('dtable-icon-spin');
  });

  it('renders arrow-right-b SVG in FieldDisplaySetting and arrow-right SVG in RightAngle', () => {
    const { container } = render(
      <FieldDisplaySetting
        fields={[]}
        textProperties={{ titleValue: 'Fields', bannerValue: 'All', showValue: 'Show', hideValue: 'Hide' }}
        fieldAllShown={true}
        onClickField={jest.fn()}
        onMoveField={jest.fn()}
        onToggleFieldsVisibility={jest.fn()}
      />
    );
    const header = container.querySelector('.field-setting-header');
    const button = header.querySelector('.expand-button');
    expect(button.querySelector('svg[data-symbol="arrow-right-b"]')).not.toBeNull();
    expect(button).not.toHaveClass('dtable-font', 'dtable-icon-right', 'revolving');

    fireEvent.click(header);
    expect(button).toHaveClass('revolving');

    const { container: rightAngleContainer } = render(<RightAngle />);
    expect(rightAngleContainer.querySelector('svg[data-symbol="arrow-right"]')).not.toBeNull();
  });
});
