import CreatorFormatter from '../../src/CreatorFormatter';

export default {
  title: 'Formatter/creator',
  component: CreatorFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {},
};

const collaborators = [
  { name: 'Alex', email: 'alex@seafile.com', contact_email: 'alex@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3574700877,553982185&fm=26&gp=0.jpg' },
  { name: 'LiLei', email: 'lilei@seafile.com', contact_email: 'lilei@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3468940910,2793580922&fm=26&gp=0.jpg' },
  { name: 'Kitty', email: 'kitty@seafile.com', contact_email: 'kitty@seafile.com', avatar_url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg' },
];

export const Demo1 = {
  args: {
    value: 'alex@seafile.com',
    collaborators,
  },
  parameters: {
    docs: {
      description: {
        story: 'If the collaborator is in the collaborator list, the collaborator name and avatar will be displayed.',
      },
    },
  },
};

export const Demo2 = {
  args: {
    value: 'aaa.com',
    collaborators,
  },
  parameters: {
    docs: {
      description: {
        story: 'If the collaborator is not in the collaborator list, a default avatar and current value will be displayed.',
      },
    },
  },
};
