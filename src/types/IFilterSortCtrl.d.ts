import { IHeadConfigInternal } from "./header-config";
import { IDbEnum, IListCtrlItem, IListCtrlOptionItem, UBoolState } from "./Igeneral"

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
