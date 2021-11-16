
class Table {

  constructor(options = {}) {
    this.type = options.type || 'table';
    this.children = options.children || [generateTableRow(), generateTableRow()];
  }
}

class TableRow {

  constructor(options = {}) {
    this.type = options.type || 'table_row';
    this.children = options.children || [generateTableCell(), generateTableCell()];
  }
}

class TableCell {

  constructor(options = {}) {
    this.type = options.type || 'table_cell';
    this.children = options.children || [{type: 'paragraph', children: [{text: ''}]}];
    this.data = options.data || {align: 'left'};
  }
}

const generateTable = (options) => {
  return Object.assign({}, new Table(options));
};

const generateTableRow = (options) => {
  return Object.assign({}, new TableRow(options));
};

const generateTableCell = (options) => {
  return Object.assign({}, new TableCell(options));
};

export { generateTable, generateTableRow, generateTableCell };