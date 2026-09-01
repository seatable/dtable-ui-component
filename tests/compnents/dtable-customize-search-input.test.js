import { act, fireEvent, render, screen } from '@testing-library/react';
import DTableCustomizeSearchInput from '../../src/DTableCustomizeSearchInput';

jest.mock('../../src/DTableIcon', () => ({
  __esModule: true,
  default: () => <span data-testid="dtable-icon" />,
}));

describe('components/dtable-customize-search-input', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders the configured input', () => {
    const onChange = jest.fn();
    render(
      <DTableCustomizeSearchInput
        placeholder="Search"
        className="custom-search-input"
        value="initial"
        disabled={true}
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Search');
    expect(input).toHaveClass('custom-search-input');
    expect(input).toBeDisabled();
    expect(input).toHaveValue('initial');
  });

  it('debounces a trimmed search value', () => {
    const onChange = jest.fn();
    render(<DTableCustomizeSearchInput onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: '  keyword  ' } });

    act(() => {
      jest.advanceTimersByTime(99);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('keyword');
  });

  it('only emits the latest value during rapid consecutive input', () => {
    const onChange = jest.fn();
    render(<DTableCustomizeSearchInput wait={100} onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'first' } });
    act(() => {
      jest.advanceTimersByTime(50);
    });
    fireEvent.change(input, { target: { value: 'second' } });

    act(() => {
      jest.advanceTimersByTime(99);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('second');
  });

  it('waits for composition to finish before emitting the search value', () => {
    const onChange = jest.fn();
    render(<DTableCustomizeSearchInput wait={100} onChange={onChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: '中' } });
    fireEvent.change(input, { target: { value: '中文' } });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.compositionEnd(input);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('中文');
  });

  it('clears the input and cancels a pending search callback', () => {
    const onChange = jest.fn();
    const clearValue = jest.fn();
    const { container } = render(
      <DTableCustomizeSearchInput
        wait={100}
        onChange={onChange}
        clearValue={clearValue}
        isClearable={true}
      />
    );
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'pending' } });
    fireEvent.click(container.querySelector('.clear-icon-x'));

    expect(input).toHaveValue('');
    expect(clearValue).toHaveBeenCalledTimes(1);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('cancels a pending callback when the controlled value changes', () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <DTableCustomizeSearchInput value="initial" wait={100} onChange={onChange} />
    );
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'pending' } });
    rerender(
      <DTableCustomizeSearchInput value="replacement" wait={100} onChange={onChange} />
    );

    expect(input).toHaveValue('replacement');
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('cancels a pending callback when unmounted', () => {
    const onChange = jest.fn();
    const { unmount } = render(
      <DTableCustomizeSearchInput wait={100} onChange={onChange} />
    );

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'pending' } });
    unmount();
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
