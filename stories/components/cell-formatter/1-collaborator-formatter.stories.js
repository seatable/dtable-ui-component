import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import ShowCode from '../../utils/show-code';
import Description from '../../utils/description';
import { CollaboratorFormatter } from '../../../src/components/cell-formatter';

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
  {name: 'Alex', email: 'shanshuirenjia@seafile.com', contact_email: 'shanshuirenjia@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3574700877,553982185&fm=26&gp=0.jpg'},
  {name: 'LiLei', email: 'xiaoqiang@seafile.com', contact_email: 'xiaoqiang@seafile.com', avatar_url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3468940910,2793580922&fm=26&gp=0.jpg'},
  {name: 'Kitty', email: 'xiaohong@seafile.com', contact_email: 'xiaohong@seafile.com', avatar_url: 'https://www.foodiesfeed.com/free-food-photo/lady-with-a-glass-of-red-wine-in-a-wine-shop/'},
];

storiesOf('CELLS|collaborator-formatter', module)
  .addDecorator(withInfo)
  .add('Collaborators show component', () => (
    <div>
      <h1>Scene One: The component contains a delete button</h1>
      <ShowCode sub={"A collaborator"}>
        <Description>If the collaborator is not in the collaborator list, a default avatar and current value will be displayed.</Description>
        <CollaboratorFormatter 
          value={'Alex'} 
          containerClassName={''} 
          collaborators={collaborators}
          enableDeleteCollaborator={true}
          onDeleteCollaborator={action('delete a collaborator')}
          />
      </ShowCode>
      <ShowCode sub={"A collaborator"}>
        <Description>If the collaborator is in the collaborator list, the collaborator's name and avatar will be displayed.</Description>
        <CollaboratorFormatter 
          value={'Alex'} 
          containerClassName={''} 
          collaborators={collaborators}
          enableDeleteCollaborator={true}
          onDeleteCollaborator={action('delete a collaborator')}
          />
      </ShowCode>
      <ShowCode sub={"Multiple collaborators"}>
        <CollaboratorFormatter 
          value={['shanshuirenjia@seafile.com', 'xiaoqiang@seafile.com']} 
          containerClassName={''} 
          collaborators={collaborators}
          enableDeleteCollaborator={true}
          onDeleteCollaborator={action('delete a collaborator')}
        />
      </ShowCode>
      <h1>Scene Two: The component does not contain a delete button</h1>
      <ShowCode sub={"A collaborators"}>
        <CollaboratorFormatter value={'Alex'} containerClassName={''} collaborators={collaborators} />
      </ShowCode>
      <ShowCode sub={"Multiple collaborators"}>
        <CollaboratorFormatter value={['shanshuirenjia@seafile.com', 'xiaoqiang@seafile.com']} containerClassName={''} collaborators={collaborators} />
      </ShowCode>
    </div>
  ), {info})






