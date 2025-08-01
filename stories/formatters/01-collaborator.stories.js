import { fn } from 'storybook/test';
import CollaboratorFormatter from '../../src/CollaboratorFormatter';

export default {
  title: 'Formatter/collaborator',
  component: CollaboratorFormatter,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onDeleteCollaborator: fn() },
};

const collaborators = [
  { name: 'Alex', email: 'alex@seafile.com', contact_email: 'alex@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3574700877,553982185&fm=26&gp=0.jpg' },
  { name: 'LiLei', email: 'lilei@seafile.com', contact_email: 'lilei@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3468940910,2793580922&fm=26&gp=0.jpg' },
  { name: 'Kitty', email: 'kitty@seafile.com', contact_email: 'kitty@seafile.com', avatar_url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg' },
];

export const Demo1 = {
  args: {
    isReadOnly: true,
    value: 'Alex',
    containerClassName: '',
    collaborators,
    enableDeleteCollaborator: true,
  },
};

export const Demo2 = {
  args: {
    isReadOnly: true,
    value: 'Alex',
    containerClassName: '',
    collaborators,
    enableDeleteCollaborator: false,
  },
};
