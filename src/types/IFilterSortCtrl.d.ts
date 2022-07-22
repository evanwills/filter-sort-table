import { IDbEnum, IListCtrlItem, IListCtrlOptionItem, UBoolState, UDataType } from "./Igeneral"

export type UDataType = 'text' | 'number' | 'date' | 'datetime' | 'bool' | 'option' | 'count';

export type IFilterSortCtrl = {
  action : string,
  dataType : UDataType,
  stateSlice : string,
  colName : string,
  order : UBoolState,
  childID : number,
  filter : string | number,
  min : number,
  max : number,
  bool : UBoolState,
  showMinMax : boolean,
  stateData : IListCtrlItem | null,
  options : Array<IDbEnum> | string,
  value : string | number,
  expanded : boolean,
  alwaysExpanded : boolean,
  sortByValue : boolean,
  doInit : boolean,
  filteredOptions : Array<IListCtrlOptionItem>
}

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


/**
 * Usabel data from a Filter Sort Control component change event
 */
export type IFilterSortCtrlData = {
  /**
   * Name of the column that was updated
   */
  colName: string,
  /**
   * Property that was changed
   */
  changed: string,
  /**
   * Sort order state for column
   */
  order: UBoolState,
  /**
   * String/Number to filter values on
   */
  filter: string|number,
  /**
   * For numeric & date/datetime values minimum value to include in
   * filter
   */
  min: number,
  /**
   * For numeric & date/datetime values maximum value to include in
   * filter
   */
  max: number,
  /**
   * State of boolean filter
   */
  bool: UBoolState,
  /**
   * List of include/include states for option filter
   */
  options: Array<IListCtrlOptionItem>
}

export type IFilterUpdateResult = {
  item: IHeadConfigInternal,
  hasChanged: boolean,
  resetOrder: boolean,
  moveExport: boolean,
  moveCol: boolean
}

export type IAllFiltersUpdateResult = {
  filters: Array<IHeadConfigInternal>,
  hasChanged: boolean
}
