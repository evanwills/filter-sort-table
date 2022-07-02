import { IListCtrlItem, UBoolState, UDataType } from "./Igeneral";

/**
 * IHeadConfig represents configuration for one field in an object
 * that is to be rendered in a table row.
 */
 export interface IHeadConfig {
  /**
   * Property name in row object that holds the date for this column
   */
  prop: string,
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
   * If this is not empty, the value of the cell will be linked to
   * the URL held in the field this references
   */
  urlField ? : string,
  /**
   * List of option IDs and labels
   */
  enumList ? : Array<IDbEnum>,
  /**
   * Configuration for the filter/sort control
   */
  ctrl ? : IListCtrlItem
  /**
   * If there is not filter control, (and thus no data type set for
   * the column). This allows caller to set a specific data type for
   * the column.
   *
   * > __NOTE:__ If no data type is set `text` is the default
   */
  type ? : UDataType
}
