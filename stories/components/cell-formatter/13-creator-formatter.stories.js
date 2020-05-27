import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import { CreatorFormatter } from '../../../src/components/cell-formatter';

const info = {
  text: '<h1>API</h1>',
  inline: true,
  source: false,
  propTablesExclude: [ShowCode, Description],
  styles: {
    header: {
      h1: {
        'marginBottom': '8px'
      }
    }
  }
};

const collaborators = [
  {name: 'Alex', email: 'alex@seafile.com', contact_email: 'alex@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3574700877,553982185&fm=26&gp=0.jpg'},
  {name: 'LiLei', email: 'lilei@seafile.com', contact_email: 'lilei@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3468940910,2793580922&fm=26&gp=0.jpg'},
  {name: 'Kitty', email: 'kitty@seafile.com', contact_email: 'kitty@seafile.com', avatar_url: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=139910319,1330512143&fm=26&gp=0.jpg'},
];

storiesOf('CELLS|creator-formatter', module)
  .addDecorator(withInfo)
  .add('Creator show component', () => (
    <div>
      <ShowCode sub={"A creator"}>
        <Description>If the collaborator is not in the collaborator list, a default avatar and current value will be displayed.</Description>
        <CreatorFormatter 
          value={'abc'} 
          containerClassName={''} 
          collaborators={collaborators}
          />
      </ShowCode>
      <ShowCode sub={"A creator"}>
      <Description>If the collaborator is in the collaborator list, the collaborator's name and avatar will be displayed.</Description>
        <CreatorFormatter 
          value={'alex@seafile.com'} 
          containerClassName={''} 
          collaborators={collaborators}
        />
      </ShowCode>
    </div>
  ), {info})






