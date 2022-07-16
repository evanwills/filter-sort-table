// import { tableData } from "../data/form-data";
import { getDataType } from "../utilities/filter-sort.utils";

test(
  'getDataType() "text" is valid data type',
  () => {
    expect(getDataType('text')).toBe('text');
  }
);

test(
  'getDataType() "Number " is valid data type (after making lowercase & trimming)',
  () => {
    expect(getDataType('Number ')).toBe('number');
  }
);

test(
  'getDataType() "   DATE " is valid data type (after making lowercase & trimming)',
  () => {
    expect(getDataType('   DATE ')).toBe('date');
  }
);

test(
  'getDataType() "dateTime" is valid data type (after making lowercase & trimming)',
  () => {
    expect(getDataType('dateTime')).toBe('datetime');
  }
);

test(
  'getDataType() "bool" is valid data type',
  () => {
    expect(getDataType('bool')).toBe('bool');
  }
);

test(
  'getDataType() "option" is valid data type',
  () => {
    expect(getDataType('option')).toBe('option');
  }
);

test(
  'getDataType() "count" is valid data type',
  () => {
    expect(getDataType('count')).toBe('count');
  }
);

test(
  'getDataType() "foo" is an invalud data type so (default) "text" is returned',
  () => {
    expect(getDataType('foo')).toBe('text');
  }
);
