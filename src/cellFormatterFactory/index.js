import formatterConfig from '../formatterConfig';

class CellFormatterFactory {

  createFormatter(formatterType) {
    if (formatterConfig[formatterType]) {
      return formatterConfig[formatterType];
    }

    return null;

  }
}

const cellFormatterFactory = new CellFormatterFactory();

export default cellFormatterFactory;
