import FormatterConfig from '../cell-formatter/formatter-config';

class CellFormatterFactory {

  createFormatter(formatterType) {
    if (FormatterConfig[formatterType]) {
      return FormatterConfig[formatterType];
    }

    return null;

  }
}

const cellFormatterFactory = new CellFormatterFactory();

export default cellFormatterFactory;