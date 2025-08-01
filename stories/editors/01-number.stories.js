import { fn } from 'storybook/test';
import { NUMBER_TYPES } from '../../src/constants';
import NumberEditor from '../../src/NumberEditor';

export default {
  title: 'Editor/number',
  component: NumberEditor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onCommit: fn() },
};

const value1_1 = 12345;
const column1_1 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER,
  name: 'number',
  data: {
    format: NUMBER_TYPES.NUMBER
  }
};

const column1_2 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER_WITH_COMMAS,
  name: 'number_with_commas',
  data: {
    format: NUMBER_TYPES.NUMBER_WITH_COMMAS
  }
};

const column1_3 = {
  key: '0000',
  type: NUMBER_TYPES.DOLLAR,
  name: 'dollar',
  data: {
    format: NUMBER_TYPES.DOLLAR
  }
};

const column1_4 = {
  key: '0000',
  type: NUMBER_TYPES.EURO,
  name: 'euro',
  data: {
    format: NUMBER_TYPES.EURO
  }
};

const column1_5 = {
  key: '0000',
  type: NUMBER_TYPES.YUAN,
  name: 'yuan',
  data: {
    format: NUMBER_TYPES.YUAN
  }
};

const column1_6 = {
  key: '0000',
  type: NUMBER_TYPES.PERCENT,
  name: 'percent',
  data: {
    format: NUMBER_TYPES.PERCENT
  }
};

const value2_1 = 78222;
const column2_1 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER,
  name: 'number',
  data: {
    format: NUMBER_TYPES.NUMBER
  }
};

const column2_2 = {
  key: '0000',
  type: NUMBER_TYPES.NUMBER_WITH_COMMAS,
  name: 'number_with_commas',
  data: {
    format: NUMBER_TYPES.NUMBER_WITH_COMMAS
  }
};

const column2_3 = {
  key: '0000',
  type: NUMBER_TYPES.DOLLAR,
  name: 'dollar',
  data: {
    format: NUMBER_TYPES.DOLLAR
  }
};

const column2_4 = {
  key: '0000',
  type: NUMBER_TYPES.EURO,
  name: 'euro',
  data: {
    format: NUMBER_TYPES.EURO
  }
};

const column2_5 = {
  key: '0000',
  type: NUMBER_TYPES.YUAN,
  name: 'yuan',
  data: {
    format: NUMBER_TYPES.YUAN
  }
};

const column2_6 = {
  key: '0000',
  type: NUMBER_TYPES.PERCENT,
  name: 'percent',
  data: {
    format: NUMBER_TYPES.PERCENT
  }
};

export const Demo1 = {
  args: {
    isReadOnly: true,
    value: value1_1,
    column: column1_1,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'NUMBER\'',
      },
    },
  },
};

export const Demo2 = {
  args: {
    isReadOnly: true,
    value: value1_1,
    column: column1_2,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'NUMBER_WITH_COMMAS\'',
      },
    },
  },
};

export const Demo3 = {
  args: {
    isReadOnly: true,
    value: value1_1,
    column: column1_3,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'DOLLAR\' ',
      },
    },
  },
};

export const Demo4 = {
  args: {
    isReadOnly: true,
    value: value1_1,
    column: column1_4,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'EURO\' ',
      },
    },
  },
};

export const Demo5 = {
  args: {
    isReadOnly: true,
    value: value1_1,
    column: column1_5,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'YUAN\' ',
      },
    },
  },
};

export const Demo6 = {
  args: {
    isReadOnly: true,
    value: value1_1,
    column: column1_6,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'PERCENT\' ',
      },
    },
  },
};

export const Demo7 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_1,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'NUMBER\''
      },
    },
  },
};

export const Demo8 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_2,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'NUMBER_WITH_COMMAS\'',
      },
    },
  },
};

export const Demo9 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_3,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'DOLLAR\'',
      },
    },
  },
};

export const Demo10 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_4,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'EURO\'',
      },
    },
  },
};

export const Demo11 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_5,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'YUAN\'',
      },
    },
  },
};

export const Demo12 = {
  args: {
    isReadOnly: false,
    value: value2_1,
    column: column2_6,
  },
  parameters: {
    docs: {
      description: {
        story: 'number format: \'PERCENT\'',
      },
    },
  },
};
