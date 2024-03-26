import React from 'react';
import LastModifierFormatter from '../../../src/LastModifierFormatter';

import '../../css/cell-formatter.css';

const collaborators = [
  {name: 'Alex', email: 'alex@seafile.com', contact_email: 'alex@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3574700877,553982185&fm=26&gp=0.jpg'},
  {name: 'LiLei', email: 'lilei@seafile.com', contact_email: 'lilei@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3468940910,2793580922&fm=26&gp=0.jpg'},
  {name: 'Kitty', email: 'kitty@seafile.com', contact_email: 'kitty@seafile.com', avatar_url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg'},
];

const meta = {
  title: 'Formatters/last-modifier-formatter',
  component: LastModifierFormatter,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      return (
        <div>
          {context.parameters.title && <h1>{context.parameters.title}</h1>}
          {context.parameters.subTitle && <p className='storybook-sub'>{context.parameters.subTitle}</p>}
          <Story />
        </div>
      );
    }
  ],
  parameters: {
    title: '',
    subTitle: '',
  }
};

export default meta;

export const Demo1 = {
  args: {
    value: 'alex@seafile.com',
    collaborators,
    containerClassName: '',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'If the collaborator is in the collaborator list, the collaborator name and avatar will be displayed'
  }
};

export const Demo2 = {
  args: {
    value: 'test@seafile.com',
    collaborators,
    containerClassName: '',
  },
  parameters: {
    // title: 'Scene One: editor permission is readonly',
    subTitle: 'If the collaborator is not in the collaborator list, a default avatar and current value will be displayed'
  }
};
