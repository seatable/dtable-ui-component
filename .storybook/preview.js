/** @type { import('@storybook/react-webpack5').Preview } */

import '../public/media/dtable-font.css';
import '../public/media/seatable-ui.css';
import '../stories/css/story-cover.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'General',
          'Formatter',
          'Editor',
          'Mobile',
        ],
      },
    },
  },
};

export default preview;
