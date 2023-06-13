import React from 'react';
import { CellType } from 'dtable-store';
import { Row, Col } from 'reactstrap';
import { DTABLE_VALUE, COLUMNS_ICON_CONFIG } from './data/dtable-value';
import EditorFormatter from './editor-formatter';

import './app.css';

class App extends React.Component {

  renderRow = () => {
    this.value = DTABLE_VALUE;
    const table = this.value.tables[0];
    const { rows, columns } = table;
    const row = rows[0];
    return columns.map(column => {
      const props = {
        isRowExpand: true,
        row,
        column,
        className: 'readonly-form-control',
        empty: {component: <div className={`dtable-ui cell-formatter-container ${column.type}-formatter`}></div>},
        getOptionColors: () => {},
        CellType: CellType,
      };
      const { key, type, name } = column;
      return (
        <Row className="pb-4" key={key}>
          <Col md={3}>
            <span className="header-icon" id={`header-icon-${key}`}>
              <i className={COLUMNS_ICON_CONFIG[type]}></i>
            </span>
            <span className="column-name">{name || ''}</span>
          </Col>
          <Col md={9} className='d-flex align-items-center'>
            <EditorFormatter {...props} />
          </Col>
        </Row>
      );
    });
  }

  render() {
    return (
      <div className="app">
        <header className="app-header mt-4">
          <h1 className="text-center">{'seatable ui component test'}</h1>
        </header>
        <div className="app-body">
          {this.renderRow()}
        </div>
      </div>
    );
  }
}

export default App;
