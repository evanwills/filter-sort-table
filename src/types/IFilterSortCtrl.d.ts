import { IDbEnum, IListCtrlItem, UBoolState } from "./Igeneral"

type UDataType = 'text' | 'number' | 'date' | 'datetime' | 'bool' | 'option' | 'count';

export type IFilterSortCtrl = {
  action : string,
  dataType : UDataType,
  stateSlice : string,
  colName : string,
  order : number,
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
