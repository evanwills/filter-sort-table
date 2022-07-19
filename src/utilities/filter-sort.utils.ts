// import { customElement, property, state } from 'lit/decorators.js';

import {
  IDbEnum, IListCtrlItem, IListCtrlOptionItem, IObjNum, IObjScalarX,
  UBoolState, UDataType
} from '../types/Igeneral';

import { isNumber } from './validation';
// import { isoStrToTime } from './sanitise';
import { getBoolState } from './general.utils';
import { UScalarX } from '../types/Igeneral';
import { IHeadConfig, IHeadConfigInternal } from '../types/header-config';
import { IAllFiltersUpdateResult, IFilterSortCtrlData, IFilterUpdateResult } from '../types/IFilterSortCtrl';
import { FilterSortCtrl } from '../filter-sort-ctrl';

/**
 * This file contains a collection of pure utility functions to help
 * filter-sort-ctrl & filter-sort-table
 *
 * None of these functions have side effects
 * All can be unit tested with minimal setup
 */


/**
 * Parse a string for options that can be used in an option filter
 *
 * @param input String with the patter: [number:label,]
 *
 * @returns List of objects that can be used
 */
export const parseOptStr = (input : string) : Array<IDbEnum> => {
  const regex = /(?<=^|,)([0-9]+):(.*?)(?=,[0-9]|$)/ig;
  let match: RegExpExecArray|null;
  const output : Array<IDbEnum>= [];

  while ((match = regex.exec(input as string)) !== null) {
    if (isNumber(match[1])) {
      const opt : IDbEnum = {
        id: parseInt(match[1]),
        name: match[2],
        description: ''
      }

      output.push(opt);
    }
  }

  return output;
}

/**
 * Get current option mode for a single option
 *
 * @param id      ID of option to get value from
 * @param filters List of all filter options for a single field
 *
 * @returns Current state for single
 */
export const getOptMode = (
  id: number, filters: Array<IListCtrlOptionItem>
) : UBoolState => {
  const filter = filters.filter((item: IListCtrlOptionItem) => (item.id === id));
  return (filter.length === 1)
    ? filter[0].mode
    : 0
}

/**
 * Test whether a filter has any options set
 *
 * @param options List of option items for a filter.
 *
 * @returns TRUE if one or more options are set to either include or exclude
 */
export const hasFilteredOpts = (options : Array<IListCtrlOptionItem>) : boolean => {
  for (let a = 0; a < options.length; a += 1) {
    if (options[a].mode !== 0) {
      return true;
    }
  }

  return false;
}

/**
 * Update list of option for a single field based on values set by
 * a recently changed input field
 *
 * @param filteredOptions List of all filter options for a single field
 * @param input           HTML input field that was just changed
 *
 * @returns Update list of all filter options for a single field
 */
export const getUpdatedFilterOpt = (
  filteredOptions : Array<IListCtrlOptionItem>,
  input : HTMLInputElement
) : Array<IListCtrlOptionItem> => {
  let childID = (typeof input.dataset.childId !== 'undefined')
    ? parseInt(input.dataset.childId)
    : -1;

  return filteredOptions.map((item : IListCtrlOptionItem) : IListCtrlOptionItem => {
    return (item.id === childID)
      ? { ...item, mode: getBoolState(input.value) }
      : item;
  });
}

/**
 * Stringify toggled options for a fixed option field
 *
 * each option is comma separated
 * Individual options have an ID & value separated by a colon
 *
 * e.g. "0:1,3:-1,4:-1,7:1"
 *
 * @param filteredOptions list of non-ignore options for a single
 *                        filter field
 *
 * @returns String representation of toggled options for a single
 *          field
 */
export const getOptStr = (filteredOptions : Array<IListCtrlOptionItem>) : string => {
  let output = '';
  let sep = '';

  // console.group('_getOptStr()')

  for (let a = 0; a < filteredOptions.length; a += 1) {
    if (filteredOptions[a].mode !== 0) {
      output += sep + filteredOptions[a].id + ':' + filteredOptions[a].mode;
      sep = ',';
      // console.log('output:', output);
    }
  }
  // console.log('output:', output);
  // console.groupEnd();

  return output;
}

/**
 * Get item from an array based on item's ID value matching the
 * supplied ID value
 *
 * @param {string}  varName Name of enum list
 * @param {integer} id      value of the id property to me matched
 *
 * @returns {object,false} matched object or FALSE if object was not matched by ID
 */
export const getEnumIdByName = (enums : Array<IDbEnum>, name : string) : number => {
  for (let a = 0; a < enums.length; a += 1) {
    if (enums[a].name === name) {
      return enums[a].id
    }
  }

  return -1;
}

/**
 * Array.filter callback function for filtering data based on fixed option
 *
 * @param options List of options for a field
 * @param id      ID of option listed for row
 *
 * @returns TRUE if option was not filtered out. FALSE otherwise
 */
const filterOnOptions = (options : Array<IListCtrlOptionItem>, id: number) : boolean => {
  const inc : number[] = [];
  const exc : number[] = [];

  for (let a = 0; a < options.length; a += 1) {
    if ((options[a].mode === -1)) {
      exc.push(options[a].id);
    } else if ((options[a].mode === 1)) {
      inc.push(options[a].id);
    }
  }

  if ((inc.length > 0 && inc.indexOf(id) === -1) ||
      (exc.length > 0 && exc.indexOf(id) > -1)
  ) {
    return false;
  } else {
    return true;
  }
}

/**
 * Test whether or not to
 * @param listCtrl
 * @returns
 */
export const skipFilter = (listCtrl: IHeadConfig) : boolean => {
  // console.group('skipFilter()')
  // console.log('listCtrl.isFilter:', listCtrl.isFilter)
  // console.log('listCtrl.filter:', listCtrl.filter, listCtrl.filter !== '')
  // console.log('listCtrl.min:', listCtrl.min, listCtrl.min !== 0)
  // console.log('listCtrl.max:', listCtrl.max, listCtrl.max !== 0)
  // console.log('listCtrl.bool:', listCtrl.bool, listCtrl.bool !== 0)
  // console.log('listCtrl.filterOnEmpty:', listCtrl.filterOnEmpty)
  // console.groupEnd();
  return !(listCtrl.isFilter && (
      (listCtrl.filter !== '' && listCtrl.filter !== 0) ||
      listCtrl.min !== 0 ||
      listCtrl.max !== 0 ||
      listCtrl.bool !== 0 ||
      listCtrl.filterOnEmpty ||
      hasFilteredOpts(listCtrl.options)
    )
  )
}

/**
 * Test a single item to see if it passes all the fitlers.
 *
 * @var items    List of state items to be rendered
 * @var listCtrl List of filter & sort controls for the suplied state
 *
 * @returns TRUE if item was *NOT* excluded by any of the filters.
 *          FALSE otherwise
 */
const filterSortFilter = (item : IObjScalarX, listCtrl: Array<IHeadConfig>) : boolean => {
  // console.group('filterSortFilter()');
  // console.log('item:', item)

  for (let a = 0; a < listCtrl.length; a += 1) {
    if (listCtrl[a].skip) {
      // console.log('skip filter')
      // console.groupEnd();
      continue;
    }

    const ctl = listCtrl[a];
    let _type = typeof item[ctl.field];

    if (_type === 'undefined') {
      // console.groupEnd();
      throw new Error(
        'Cannot filter on `' + ctl.field + '` if item does contain that property'
      );
    }
    // console.group('filterSortFilter() inner');
    // console.log('listCtrl[' + a + ']:', listCtrl[a])

    let _val : UScalarX = '';

    if (Array.isArray(item[ctl.field])) {
      _val = (item[ctl.field] as Array<any>).length
    } else {
      _val = item[ctl.field]
    }

    _type = typeof _val;
    // console.log('_type:', _type)
    // console.log('_val:', _val)

    switch (ctl.type) {
      case 'text':
        // console.log('filtered on text');
        if ((_val as string).toLowerCase().indexOf((ctl.filter as string).toLowerCase()) === -1) {
          // console.log('filtered out on text');
          // console.groupEnd(); console.groupEnd();
          return false;
        }
        break;

      case 'count':
      case 'date':
      case 'datetime':
      case 'number':
        // console.log('filtreing on number')
        if (_type !== 'number') {
          // console.groupEnd(); console.groupEnd();
          throw new Error(
              'Cannot filter on `' + ctl.field + '` because item.' +
              ctl.field + ' is not a number'
          );
        }

        if (ctl.min !== 0 || ctl.max !== 0) {
          // console.log('filtering on min & max')
          if (ctl.min > _val || ctl.max < _val) {
            // console.log('val is less than min or valu is greater than max')
            // console.groupEnd(); console.groupEnd();
            return false;
          }
        } else {
          const ctlVal = (typeof ctl.filter === 'string')
            ? parseFloat(ctl.filter)
            : ctl.filter
          if (ctlVal !== 0 && _val !== ctlVal) {
            // console.log('filtering on numberic value')
            // console.groupEnd(); console.groupEnd();
            return false;
          }
        }
        break;

      case 'bool':
        // console.log('filtering on boolean')
        if (_type !== 'boolean') {
          // console.groupEnd(); console.groupEnd();
          throw new Error(
            'Cannot filter on `' + ctl.field + '` because item.' +
            ctl.field + ' is not boolean'
          );
        }
        if ((ctl.bool === 1 && _val === false)
          || (ctl.bool === -1 && _val === true)
        ) {
          // console.log('filtered out on bool');
          // console.groupEnd(); console.groupEnd();
          return false;
        }

        break;

      case 'option':
        // console.log('filtering on option')
        if (_type === 'string') {
          if (typeof ctl.enumList === 'undefined') {
            // console.groupEnd(); console.groupEnd();
            throw new Error(
              'Cannot get value to match filter on `' + ctl.field + '` because ' +
              ctl.field + ' does not contain a list of optons to match on'
            );
          }
          _val = getEnumIdByName(ctl.enumList, (_val as string));
          if (_val !== -1) {
            _type = 'number';
          }
        }
        if (_type !== 'number') {
          // console.groupEnd(); console.groupEnd();
          throw new Error(
              'Cannot filter on `' + ctl.field + '` because item.' +
              ctl.field + ' is not a number'
          );
        }
        if (filterOnOptions(ctl.options, _val as number) === false) {
          // console.log('filtered out on option');
          // console.groupEnd(); console.groupEnd();
          return false;
        }
    }
    // console.groupEnd();
  }

  // console.groupEnd();
  return true;
}

/**
 * Order all items in the list so they are sorted as required
 *
 * @var items    List of state items to be rendered
 * @var listCtrl List of filter & sort controls for the suplied state
 *
 * @returns TRUE if item was *NOT* excluded by any of the filters.
 *          FALSE otherwise
 */
const filterSortSort = (items : Array<IObjScalarX>, listCtrl: Array<IListCtrlItem>) : Array<IObjScalarX> => {
  if (listCtrl.length === 0) {
    // Nothing to sort so just return input unchanged
    return items;
  }

  // Remove any controls that are set to ignore when sorting
  const tmpCtrl : Array<IListCtrlItem> = listCtrl.filter(
    (ctrlItem : IListCtrlItem) : boolean => {
      return (ctrlItem.order !== 0 && ctrlItem.orderPriority > -1);
    }
  )

  // Sort all remaining controls so the least recently set is sorted
  // first and the most recently set is sorted last
  tmpCtrl.sort((a : IListCtrlItem, b: IListCtrlItem) : number => {
    if (a.orderPriority < b.orderPriority) {
      return -1;
    } else if (a.orderPriority > b.orderPriority) {
      return 1;
    } else {
      return 0;
    }
  });

  // We're trying to be immutable so do a shallow clone
  // This function doesn't touch the children so a shallow
  // clone will be fine.
  const output = [...items];

  const tmp = [...tmpCtrl];
  let next = tmp.shift();

  while (typeof next !== 'undefined') {
    const ctl = next;
    next = tmp.shift();

    console.log('ctl:', ctl)

    output.sort((a : IObjScalarX, b : IObjScalarX) => {
      const prop = ctl.field;
      const _aType = typeof a[prop];
      const _bType = typeof b[prop];

      if (_aType === 'undefined' || _bType === 'undefined') {
        console.log('ctl:', ctl)
        console.log('a:', a)
        console.log('b:', b)
        console.error('one of the items didn\'t have the right field');
      } else if (_aType !== _bType) {
        console.log('ctl:', ctl);
        console.log('a:', a);
        console.log('b:', b);
        console.error('type of field in A doesn\'t match type of field in B');
      }
      const aVal = (ctl.type !== 'count')
        ? a[prop]
        : (a[prop] as Array<any>).length;
      const bVal = (ctl.type !== 'count')
        ? b[prop]
        : (b[prop] as Array<any>).length;

      if (aVal < bVal) {
        return ctl.order * -1;
      } else if (aVal > bVal) {
        return ctl.order;
      }

      // Looks like everything matched so this one stays put
      return 0
    });
  }

  return output;
}

/**
 * Filter and sort a list of items for rendering
 *
 * @param items    List of items to be filtered
 * @param listCtrl Filter control list
 *
 * @returns Filtered & sorted list of items
 */
export const filterAndSort = (items : Array<IObjScalarX>, listCtrl : Array<IHeadConfig>) : Array<IObjScalarX> => {
  // console.log(items);
  return filterSortSort(
    items.filter((item : IObjScalarX) : boolean => filterSortFilter(item, listCtrl)),
    listCtrl
  );
}

/**
 * Ensure data type is valid
 *
 * @param input Data type to be validated
 *
 * @returns Valid data type
 */
export const getDataType = (input : string) : UDataType => {
  const _input = input.toLowerCase().trim();

  switch (_input) {
    case 'text':
    case 'number':
    case 'date':
    case 'datetime':
    case 'bool':
    case 'option':
    case 'count':
      return _input;

    default:
      console.error('Could not match data type: "' + input + '"');
      return 'text';
  }
}

/**
 * Extract data from Filter Sort Control component into a simple
 * object that can be used in pure functions.
 *
 * @param filter Filter Sort Control web component object
 *
 * @returns Useful data from Filter Sort Control component in a
 *          simple object
 */
export const getHeadConfigInt = (ctrl : IHeadConfig|IHeadConfigInternal) : IHeadConfigInternal => {
  return {
    ...ctrl,
    skip: (typeof ctrl.skip === 'boolean')
      ? ctrl.skip
      : skipFilter(ctrl)
  }
}

export const getDummyCtrl = (colName : string, changed: string, filter: string|number = '') : IFilterSortCtrlData => {
  return {
    colName: colName,
    changed: changed,
    filter: filter,
    order: 0,
    min: 0,
    max: 0,
    bool: 0,
    options: []
  };
}

/**
 * Extract data from Filter Sort Control component into a simple
 * object that can be used in pure functions.
 *
 * @param filter Filter Sort Control web component object
 *
 * @returns Useful data from Filter Sort Control component in a
 *          simple object
 */
export const getFilterSortCtrlData = (filter: FilterSortCtrl) : IFilterSortCtrlData => {
  return {
    colName: filter.colName,
    changed: (typeof filter.dataset.subtype2 == 'string')
      ? filter.dataset.subtype2
      : '',
    order: filter.order,
    filter: filter.filter,
    min: filter.min,
    max: filter.max,
    bool: filter.bool,
    options: filter.filteredOptions
  }
}

/**
 * Update a single filter control
 *
 * @param field      Filter Control object to be updated
 * @param ctrl       Data generated by user interaction
 * @param toggleCols Whether or not column visiblity can be toggled
 * @param moveCols   Whether or not column order can be changed
 *
 * @returns Updated version of field (if field has been changed) or
 *          original field object if nothing was changed
 */
export const updateFilter = (
  field : IHeadConfigInternal,
  ctrl : IFilterSortCtrlData,
  toggleCols: boolean = false,
  moveCols: boolean = false
) : IFilterUpdateResult => {
  let hasChanged : boolean = false;
  let resetOrder: boolean = false;
  let moveExport: boolean = false;
  let moveCol: boolean = false
  const output : IHeadConfigInternal = { ...field }

  if (ctrl.colName === field.field) {
    switch(ctrl.changed) {
      case 'order':
        if (field.order !== ctrl.order) {
          output.order = ctrl.order;
          hasChanged = true;
          // Multiple fields may be effected by this action so
          // another function needs to be called to update any other
          // effected fields
          resetOrder = true;
        }
        break;

      case 'filter':
        if (field.filter !== ctrl.filter) {
          output.filter = ctrl.filter;
          hasChanged = true;
        }
        break;

      case 'min':
        if (field.min !== ctrl.min) {
          output.min = ctrl.min;
          if (output.max !== 0 && output.max < output.min) {
            output.max = output.min;
          }
          hasChanged = true;
        }
        break;

      case 'max':
        if (field.max !== ctrl.max) {
          output.max = ctrl.max;
          if (output.min !== 0 && output.min > output.max) {
            output.min = output.max;
          }
          hasChanged = true;
        }
        break;

      case 'bool':
        if (field.bool !== ctrl.bool) {
          output.bool = ctrl.bool;
          hasChanged = true;
        }
        break;

      case 'option':
        if (field.options !== ctrl.options) {
          output.options = ctrl.options;
          hasChanged = true;
        }
        break;

      case 'filter-on-empty':
        output.filterOnEmpty = !output.filterOnEmpty;
        hasChanged = true;
        break;

      case 'is-column':
        // console.log('output.isColumn (before):', output.isColumn)
        if (toggleCols) {
          output.isColumn = !output.isColumn;
          hasChanged = true;
        }
        // console.log('output.isColumn (after):', output.isColumn)
        break;

      case 'move-column':
        // move column needs a separate function call because two
        // fields are effected by this action.
        if (moveCols) {
          hasChanged = true;
          moveCol = true;
        }
        // console.log('output.isColumn (before):', output.isColumn)
        // console.log('output.isColumn (after):', output.isColumn)
        break;

      case 'in-export':
        hasChanged = true;
        // console.log('output.isColumn (before):', output.isColumn)
        output.export = !output.export;
        // console.log('output.isColumn (after):', output.isColumn)
        break;

      case 'move-export':
        // move export needs a separate function call because two
        // fields are effected by this action.
        hasChanged = true;
        moveExport = true;
        // console.log('output.isColumn (before):', output.isColumn)
        // console.log('output.isColumn (after):', output.isColumn)
        break;

      default:
        console.error(
          'Could not work out what to update using "' +
          ctrl.changed + '"'
        );
    }
    // console.log('output:', output);
    output.skip = skipFilter(output);
  }

  return {
    item: (hasChanged)
      ? output
      : field,
    hasChanged: hasChanged,
    moveCol: moveCol,
    moveExport: moveExport,
    resetOrder: resetOrder
  };
}

/**
 * Update list of filters based on values from user input.
 *
 * @param filters   List of all filters for table
 * @param ctrl      Data from Filter Sort Control change event
 * @param toggleCols Whether or not column visiblity can be toggled
 * @param moveCols   Whether or not column order can be changed
 *
 * @returns Update list of filters
 */
export const updateFilters = (
  filters : Array<IHeadConfigInternal>,
  ctrl : IFilterSortCtrlData,
  toggleCols: boolean = false,
  moveCols: boolean = false
) : IAllFiltersUpdateResult => {
  let resetOrder : boolean = false;
  let moveExport : boolean = false;
  let hasChanged : boolean = false;
  let moveCol : boolean = false;

  let output : Array<IHeadConfigInternal> = [...filters];

  for (let a = 0; a < output.length; a += 1) {
    const data = updateFilter(output[a], ctrl, toggleCols, moveCols);

    if (data.hasChanged) {
      hasChanged = true;
      resetOrder = data.resetOrder;
      moveExport = data.moveExport;
      moveCol = data.moveCol;
      output[a] = data.item;
      break;
    }
  }

  if (resetOrder) {
    output = setSortOrderHC(output, ctrl.colName, ctrl.order);
  } else if (moveExport) {
    output = moveExportCol(output, ctrl.colName, ctrl.filter as string)
  } else if (moveCol) {
    output = moveTableCol(output, ctrl.colName, ctrl.filter as string)
  }

  return {
    filters: (hasChanged)
      ? output
      : filters,
    hasChanged: hasChanged
  };
}

/**
 * Update the sort order for any fields affected by the lates sort
 * order change
 *
 * @param filters List of filters
 * @param field   Name of field that has changed
 * @param order   New order for field
 *
 * @returns Updated sort order & priority for fields.
 */
export const setSortOrder = (
  filters : Array<IListCtrlItem>, field : string, order : UBoolState
) : Array<IListCtrlItem> => {
  /**
   * Number of fields currently being sorted on.
   */
  let c = 0;

  /**
   * Previous priority for field whose sort mode has most recently
   * changed
   *
   * Used to test whether more recently sorted fields should have
   * their priority decremented to reflect the change to the current
   * field.
   */
  let oldPriority = -1;

  // Run through the list of filters twice
  // First to work out how many fields are being sorted on and
  // update/set the sort mode for the most recently updated sort
  // field.
  // Then to update the sort priority for previously sorted fields
  // (where appropriate) and to set the most recently updated field
  // to the highest priority.
  return filters.map((item : IListCtrlItem) : IListCtrlItem => {
    if (item.field === field) {
      // Record the current priority so higher priority fields can
      // be decrmented
      oldPriority = item.orderPriority;

      return {
        ...item,
        // Update the sort mode for this field to reflect user
        // interaction
        order: order,
        // Reset the priority for the for the field being changed.
        orderPriority: -1
      }
    } else {
      if (item.order !== 0) {
        // count the number of fields being sorted
        c += 1;
      }

      return item;
    }
  }).map((item: IListCtrlItem) : IListCtrlItem => {
    if (item.field === field && order !== 0) {
      // Make the changed field the highest priority
      item.orderPriority = c;
    } else if (oldPriority > -1 && item.orderPriority > oldPriority) {
      return {
        ...item,
        // decrement the priority of fields that were being sorted
        // after the most recently updated field
        orderPriority: item.orderPriority - 1
      }
    }

    return item;
  });
}


/**
 * Update the sort order for any fields affected by the lates sort
 * order change
 *
 * @param filters List of filters
 * @param field   Name of field that has changed
 * @param order   New order for field
 *
 * @returns Updated sort order & priority for fields.
 */
 export const setSortOrderHC = (
  filters : Array<IHeadConfigInternal>, field : string, order : UBoolState
) : Array<IHeadConfigInternal> => {
  const tmp : Array<IListCtrlItem> = setSortOrder(
    filters.map(headConfigToListCtrl),
    field,
    order
  );

  return filters.map(
    (item: IHeadConfigInternal, index : number) : IHeadConfigInternal => {
      if (typeof tmp[index] !== undefined && tmp[index].field === item.field) {
        return {
          ...item,
          ...tmp[index]
        };
      } else {
        console.error('Updated filter could not be reintegrated')
        console.log('item:', item)
        console.log('tmp:', tmp)
        return item;
      }
    }
  );
}

/**
 * Convert a IHeadConfig item to a IListCtrlItem
 *
 * @param item Head config item
 *
 * @returns
 */
export const headConfigToListCtrl = (item: IHeadConfig) : IListCtrlItem => {
  return {
    field: item.field,
    type: item.type,
    filterOnEmpty: item.filterOnEmpty,
    filter: item.filter,
    min: item.min,
    max: item.max,
    bool: item.bool,
    options: item.options,
    order: item.order,
    orderByValue: item.orderByValue,
    orderPriority: item.orderPriority,
    export: item.export,
    exportOrder: item.exportOrder,
    isColumn: item.isColumn,
    colOrder: item.colOrder,
    isFilter: item.isFilter
  }
}

/**
 * Convert a IHeadConfig item to a IListCtrlItem
 *
 * @param item Head config item
 *
 * @returns
 */
export const headConfigToInternal = (item: IHeadConfig) : IHeadConfigInternal => {
  return {
    ...item,
    skip: (typeof item.skip === 'boolean')
      ? item.skip
      : true
  };
}

type IColOrder = {
  field: string,
  order: number,
  index: number
}

/**
 * Update column order for all exportable columns
 *
 * @param cols List of columns/fields available for export
 *
 * @returns
 */
export const setExportColOrder = (cols : Array<IHeadConfigInternal>) : Array<IHeadConfigInternal> => {
  const defaultColOrder : Array<IColOrder> = [];

  // Get the list of columns that will be exported along with their
  // preset export order and their order withing the list of fields
  for (let a = 0; a < cols.length; a += 1) {
    // if (cols[a].export === true) {
    defaultColOrder.push({
      field: cols[a].field,
      order: cols[a].exportOrder,
      index: a
    })
    // }
  }

  // Sort the list of exportable columns so columns with predefined
  // export order are list as specified and columns with undefined
  // export order follow, in the order they are listed in the headers
  defaultColOrder.sort(
    (a: IColOrder, b:IColOrder) : number => {
      if (a.order > -1 && b.order > -1) {
        if (a.order < b.order) {
          return -1;
        } else if (a.order > b.order) {
          return 1;
        } else {
          return 0;
        }
      }

      if (a.order > -1 && b.order === -1) {
        return -1;
      } else if (a.order === -1 && b.order > -1) {
        return 1;
      } else {
        // At this point, both a.order & b.order === -1

        if (a.index < b.index) {
          return -1;
        } else if (a.index > b.index) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  )

  const newOrder : IObjNum = {};

  // Create a map of field names and their column order
  for (let a = 0; a < defaultColOrder.length; a += 1) {
    newOrder[defaultColOrder[a].field] = a;
  }

  // Update the export column order of exportable columns
  return cols.map(
    (col : IHeadConfigInternal) : IHeadConfigInternal => {
      // return (col.export === true && typeof newOrder[col.field] === 'number')
      return (typeof newOrder[col.field] === 'number')
        ? {...col, exportOrder: newOrder[col.field]}
        : col
    }
  );
}

/**
 * Sort columns by exportOrder
 *
 * Callback function passed to Array.sort()
 *
 * @param a Column A (to be compared to column B)
 * @param b Column B (to be compared to column A)
 *
 * @returns -1 if column A should be moved up compared to column B
 *          1 if column A should be moved down compared to column B
 *          0 if no change is required
 */
export const sortExportCols = (a :IHeadConfigInternal, b: IHeadConfigInternal) : number => {
  if (a.exportOrder < b.exportOrder) {
    return -1;
  } else if (a.exportOrder > b.exportOrder) {
    return 1;
  } else {
    return 0;
  }
}

/**
 * Generate a data URL for export download
 *
 * @param data           (Unfiltered) Table data to be exported
 * @param cols           Column controls
 * @param colSep         Column separator
 * @param rowSep         Row separator
 * @param includeHeaders Whether or not to include column headers
 *
 * @returns A delimited value string
 */
export const getExportDataURL = (
  data: Array<IObjScalarX>,
  cols: Array<IHeadConfigInternal>,
  colSep : string = '\t',
  rowSep : string = '\n',
  includeHeaders: boolean = true
) : string => {
  /**
   * List of rows that should be included in the export
   *
   * @var tmp
   */
  const tmp : Array<IObjScalarX> = filterAndSort(data, cols);
  /**
   * List of column controls for exportable columns
   *
   * @var exportCols
   */
  const exportCols : Array<IHeadConfigInternal> = setExportColOrder(cols.filter((col: IHeadConfigInternal) => col.export));


  // Sort the columns so they're in the right order for exporting.
  exportCols.sort(sortExportCols);

  let output = '';

  if (includeHeaders) {
    // Add column headers
    let sep = '';
    for (let a = 0; a < exportCols.length; a += 1) {
      output += sep + exportCols[a].label;
      sep = colSep;
    }
    output += rowSep;
  }

  let _rowSep = '';
  let _colSep = '';

  // Loop through each row
  for (let a = 0; a < tmp.length; a += 1) {
    output += _rowSep;

    // Loop through each column in this row
    for (let b = 0; b < exportCols.length; b += 1) {
      if (typeof tmp[a][(exportCols[b].field as string)] !== 'undefined') {
        //
        let val = tmp[a][(exportCols[b].field as string)];

        // Make sure the data is in the right format
        switch (exportCols[b].type) {
          case 'bool':
            val = (val === true) ? 'Yes' : 'No';
            break;

          case 'date':
            console.log('val:', val);
            val = new Date((val as number) * 1000).toISOString().replace(/T.*$/, '');
            break;

          case 'datetime':
            console.log('val:', val);
            val = new Date((val as number) * 1000).toISOString().replace(/T(.*?)\..*$/, ' $1');
            break;
        }

        output += _colSep + val
        _colSep = colSep;
      } else {
        // Bugger something went wrong
        // We don't have a field for this column in this row
        console.group('Bad field name')
        console.log('row:', tmp[a])
        console.log('column:', exportCols[b]);
        console.error('Bad field name: "' + exportCols[b].field + '"')
        console.groupEnd()
      }
    }

    _colSep = '';
    _rowSep = rowSep;
  }

  return output;
}

/**
 * Move a specific column's export order either up or down
 *
 * @param cols  All columns for this component
 * @param field Name of column being moved
 * @param dir   Direction of move (either up or down)
 *
 * @returns An updated list of columns where the specified column
 *          has been moved either up or down in the export column
 *          order.
 */
export const moveExportCol = (
  cols : Array<IHeadConfigInternal>, field : string, dir : string
) : Array<IHeadConfigInternal> => {
  let incrememt = (dir === 'up')
    ? -1
    : 1;
  let oldOrder = -1;

  for (let a = 0; a < cols.length; a += 1) {
    if (cols[a].field === field) {
      oldOrder = cols[a].exportOrder
      break;
    }
  }
  let newOrder = oldOrder + incrememt;
  return cols.map(
    (col) => {
      if (col.field === field) {
        return {
          ...col,
          exportOrder: newOrder
        }
      } else if (col.exportOrder === newOrder) {
        return {
          ...col,
          exportOrder: (col.exportOrder + (incrememt * -1))
        }
      } else {
        return col;
      }
    }
  );
}

/**
 * Move a specific column's table order either up or down
 *
 * @param cols  All columns for this component
 * @param field Name of column being moved
 * @param dir   Direction of move (either up or down)
 *
 * @returns An updated list of columns where the specified column
 *          has been moved either up or down in the export column
 *          order.
 */
export const moveTableCol = (
  cols : Array<IHeadConfigInternal>, field : string, dir : string
) : Array<IHeadConfigInternal> => {
  let incrememt = (dir === 'left')
    ? -1
    : 1;
  let oldOrder = -1;

  for (let a = 0; a < cols.length; a += 1) {
    if (cols[a].field === field) {
      oldOrder = cols[a].exportOrder
      break;
    }
  }
  let newOrder = oldOrder + incrememt;
  return cols.map(
    (col) => {
      if (col.field === field) {
        return {
          ...col,
          colOrder: newOrder
        }
      } else if (col.colOrder === newOrder) {
        return {
          ...col,
          colOrder: (col.colOrder + (incrememt * -1))
        }
      } else {
        return col;
      }
    }
  );
}

/**
 * The the character for the supplied usecase
 *
 * @param sep      Separator character(s) used to separate columns or
 *                 rows in export text file.
 * @param toRender Whether or not characters are to be used to render
 *                 in the UI or to be stored in state (and use in
 *                 export text file)
 *
 * @returns A string representing separator character(s) for
 *          appropriate use case
 */
export const convertSep = (sep : string, toRender: boolean) : string => {
  const special = [
    ['\t', '\\t'], ['\r', '\\r'], ['\n', '\\n'], ['\l', '\\l'], ['\r\n', '\\r\\n']
  ];
  let key = 1;
  let val = 0;

  if (toRender) {
    key = 0;
    val = 1;
  }

  for (let a = 0; a < special.length; a += 1) {
    if (special[a][key] === sep) {
      return special[a][val];
    }
  }

  return sep;
}

export const getFilterData = (listCtrl : Array<IListCtrlItem>) => (field: string) : IListCtrlItem|null => {
  // console.group(getFilterData)
  // console.log('field:', field)
  // console.log('listCtrl:', listCtrl)

  const tmp = listCtrl.filter((item : IListCtrlItem): boolean => item.field === field)

  // console.log('tmp:', tmp)
  // console.groupEnd()
  return (tmp.length === 1)
    ? tmp[0]
    : null;
}
