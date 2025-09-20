import states from '@/data/india-states.json';

const CODE_TO_NAME = states.reduce((acc, s) => {
  acc[s.code] = s.name;
  acc[s.code.toLowerCase()] = s.name;
  return acc;
}, {});

const NAME_TO_CODE = states.reduce((acc, s) => {
  acc[s.name] = s.code;
  acc[s.name.toLowerCase()] = s.code;
  return acc;
}, {});

export function codeToName(input) {
  if (!input) return '';
  return CODE_TO_NAME[input] || CODE_TO_NAME[String(input).toLowerCase()] || '';
}

export function nameToCode(input) {
  if (!input) return '';
  return NAME_TO_CODE[input] || NAME_TO_CODE[String(input).toLowerCase()] || '';
}

export function getStates() {
  return states.slice();
}
