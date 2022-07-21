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
   * Whether or not column/fields can be moved in relation to other
   * columns
   */
  canMove ? : boolean,
  /**
   * List of option IDs and labels
   */
  enumList ? : Array<IDbEnum>,
  /**
   * Wheither or not column/fields is first in the list of columns
   */
  isFirst ? : boolean,
  /**
   * Whether or not column/fields is last in the list of columns
   */
  isLast ? : boolean,
  /**
   * Whether or not this control item is currently active
   */
  skip ? : boolean,
  /**
   * Whether or not to show the toggle "filter on empty" button
   */
  toggleOnEmpty ? : boolean,
  /**
   * If this is not empty, the value of the cell will be linked to
   * the URL held in the field this referencesxHlJeg I#UrV0.h+}!oRU&^gy"Mx4
   */
  urlField ? : string,
  /**
   * Whether or not to use the event handler for this link
   */
  useHandler ? : boolean
}

export interface IHeadConfigInternal extends IHeadConfig {
  /**
   * Whether or not to show the toggle "filter on empty" button
   */
  canMove : boolean,
  /**
   * Wheither or not column/fields is first in the list of columns
   */
  isFirst : boolean,
  /**
   * Whether or not column/fields is last in the list of columns
   */
  isLast : boolean,
  /**
   * Whether or not this control item is currently active
   */
  skip: boolean,
  /**
   * Whether or not to show the toggle "filter on empty" button
   */
  toggleOnEmpty : boolean,
  /**
   * Position of this column within the list of all columns
   */
  colOrder: number,
  /**
   * Order of column in export
   */
  exportOrder: number,
  /**
   * If this is not empty, the value of the cell will be linked to
   * the URL held in the field this referencesxHlJeg I#UrV0.h+}!oRU&^gy"Mx4
   */
  urlField: string,
  /**
   * Whether or not to use the event handler for this link
   */
  useHandler : boolean
}
