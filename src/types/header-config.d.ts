import { IListCtrlItem, UBoolState, UDataType } from "./Igeneral";

/**
 * IHeadConfig represents configuration for one field in an object
 * that is to be rendered in a table row.
 */
 export interface IHeadConfig extends IListCtrlItem {
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
   * Whether or not this field should be included as a column in the
   * table
   */
  isFilter: boolean,
  /**
   * If this is not empty, the value of the cell will be linked to
   * the URL held in the field this references
   */
  urlField ? : string,
  /**
   * List of option IDs and labels
   */
  enumList ? : Array<IDbEnum>
}
