import React from 'react';
import { Row, Col } from 'reactstrap';
import DTableColumnIcon from './DTableColumnIcon';
import RowExpandFormatter from './RowExpandFormatter';
import { DTABLE_VALUE, COLLABORATORS, DEPARTMENTS, SIGN_CONFIG } from './data/dtable-value';

import './app.css';

class App extends React.Component {

  renderRow = (rowIndex) => {
    this.value = DTABLE_VALUE;
    const table = this.value.tables[0];
    const { rows, columns } = table;
    return columns.map(column => {
      const { key, name } = column;
      return (
        <Row className="pb-4" key={key}>
          <Col md={3}>
            <span className="header-icon" id={`header-icon-${key}`}>
              <DTableColumnIcon column={column} />
            </span>
            <span className="column-name">{name || ''}</span>
          </Col>
          <Col md={9} className='d-flex align-items-center'>
            <RowExpandFormatter
              row={rows[rowIndex]}
              column={column}
              valueKey={'key'}
              collaborators={COLLABORATORS}
              departments={DEPARTMENTS}
              config={SIGN_CONFIG}
            />
          </Col>
        </Row>
      );
    });
  };

  render() {
    return (
      <div className="app">
        <header className="app-header mt-4">
          <h1 className="text-center">{'seatable ui component test'}</h1>
        </header>
        <div className="app-body">
          {this.renderRow(0)}
        </div>
        <div className="app-body mt-8">
          {this.renderRow(1)}
        </div>
        <div className="app-body mt-8">
          {this.renderRow(2)}
        </div>
      </div>
    );
  }
}

export default App;
