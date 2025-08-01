import { render } from '@testing-library/react';
import Loading from '../../src/Loading';

describe('components/loading', () => {
  it('basic test', () => {
    const { container } = render(<Loading />);
    const loadingDOM = container.querySelector('span');
    expect(loadingDOM).toHaveClass('dtable-ui-loading-tip');
  });
});
