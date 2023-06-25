export const DURATION_FORMATS_MAP = {
  H_MM: 'h:mm',
  H_MM_SS: 'h:mm:ss',
  H_MM_SS_S: 'h:mm:ss.s',
  H_MM_SS_SS: 'h:mm:ss.ss',
  H_MM_SS_SSS: 'h:mm:ss.sss'
};

export const DURATION_FORMATS = [
  {name: DURATION_FORMATS_MAP.H_MM, type: DURATION_FORMATS_MAP.H_MM},
  {name: DURATION_FORMATS_MAP.H_MM_SS, type: DURATION_FORMATS_MAP.H_MM_SS}
];

export const DURATION_ZERO_DISPLAY = {
  [DURATION_FORMATS_MAP.H_MM]: '0:00',
  [DURATION_FORMATS_MAP.H_MM_SS]: '0:00',
  [DURATION_FORMATS_MAP.H_MM_SS_S]: '0:00.0',
  [DURATION_FORMATS_MAP.H_MM_SS_SS]: '0:00.00',
  [DURATION_FORMATS_MAP.H_MM_SS_SSS]: '0:00.000',
};

export const DURATION_DECIMAL_DIGITS = {
  [DURATION_FORMATS_MAP.H_MM]: 0,
  [DURATION_FORMATS_MAP.H_MM_SS]: 0,
  [DURATION_FORMATS_MAP.H_MM_SS_S]: 1,
  [DURATION_FORMATS_MAP.H_MM_SS_SS]: 2,
  [DURATION_FORMATS_MAP.H_MM_SS_SSS]: 3,
};