
type UDataType = 'text' | 'number' | 'date' | 'datetime' | 'bool' | 'option' | 'count';
type UScalar = string | number | boolean;
type UScalarX = string | number | boolean | Array<UScalar>;

type UNScalar = string | number | boolean | null;
type UNScalarX = string | number | boolean | null | Array<UNScalar>;

/**
 * headConfig represents configuration for one field in an object
 * that is to be rendered in a table row.
 */
 export interface headConfig {
  /**
   * Key in row object that hole the date for this column
   */
  key: string,
  /**
   * Column header text
   */
  label: string,
  /**
   * Whether or not this field should be included as a column in the
   * table
   */
  isColumn: boolean,
  /**
   * Whether or not the table should be filtered and or sorted on
   * this field.
   */
  isFilterable: boolean,
  /**
   * What type of data this field holds
   *
   * * `text`     Normal text
   * * `number`   Numeric value
   * * `date`     Date value
   * * `datetime` Date/time value
   * * `bool`     Boolean value
   * * `option`   One of a fixed s set off options
   * * `count`    When a field holds an array, this allows you to
   *              filter and sort on the number of items in the array
   */
  dataType: UDataType,
  /**
   * If this is not empty, the value of the cell will be linked to
   * the URL held in the field this references
   */
  urlFiels: string,
  /**
   * Whether or not the table user can file so only rows where this
   * field is empty are included
   */
  filterOnEmpty: boolean,
  /**
   * List of option IDs and labels
   */
  enumList: Array<IDbEnum>
}
