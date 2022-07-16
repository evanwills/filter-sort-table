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
   * If this is not empty, the value of the cell will be linked to
   * the URL held in the field this references
   */
  urlField ? : string,
  /**
   * Whether or not to use the event handler for this link
   */
  useHandler ? : boolean,
  /**
   * List of option IDs and labels
   */
  enumList ? : Array<IDbEnum>,
  /**
   * Whether or not this control item is currently active
   */
  skip ? : boolean
}

export interface IHeadConfigInternal extends IHeadConfig {
  /**
   * Whether or not this control item is currently active
   */
  skip: boolean
}
