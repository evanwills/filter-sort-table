import { html, TemplateResult } from 'lit';
// import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { UBoolState, FEventHandler, IDbEnum, IListCtrlOptionItem, IListCtrlItem, UDataType, UTabIndex } from '../types/Igeneral';

import { isInt, isNumber } from './validation';
// import { isoStrToTime } from './sanitise';
import { getBoolState } from './general.utils';
import { IFilterSortCtrl } from '../types/IFilterSortCtrl';
import { UScalarX } from '../types/Igeneral';
import { IHeadConfig } from '../types/header-config';

/**
 * This file contains a list of pure utility functions to help filter
 * sort controls
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
 * Render an ignore/include/execlude radio input group
 *
 * @param id       ID of filter with boolean value
 * @param value    Current state of boolean value
 * @param handler  Event handler changes to boolean value
 * @param childID  (for option fields) The ID of the option being
 *                 toggled
 * @param inc      Text for include/true state
 * @param exc      Text for exclude/false state
 * @param tabIndex Tab index (if appropriate)
 *
 * @returns
 */
export const incIgnoreExc = (
  id: string,
  value: number,
  handler : FEventHandler,
  childID: number|undefined = undefined,
  inc: string = 'Include',
  exc: string = 'Exclude',
  tabIndex: UTabIndex = undefined,
) : TemplateResult  => {
  // console.group('_incIgnoreExc()')
  // console.log('id:', id)
  // console.log('value:', value)
  // console.log('isInt(value):', isInt(value))
  // console.log('field:', field)
  // console.log('data.stateData:', data.stateData)
  const _dataType : string = (typeof childID === 'number')
    ? 'option'
    : 'bool';
  // console.groupEnd();
  return html`
    <ul class="radio-list__wrap radio-list__wrap--short">
      <li class="radio-list__item">
        <input type="radio"
               name="${id}"
               id="${id}__0"
               class="radio-list__input"
               value="0"
               data-type="${_dataType}"
               data-child-id="${ifDefined(childID)}"
               tabindex="${ifDefined(tabIndex)}"
              ?checked=${!isInt(value) || value === 0}
              @change=${handler} />
        <label for="${id}__0" class="radio-list__label radio-list__label--short">
          Ignore
        </label>
      </li>
      <li class="radio-list__item">
        <input type="radio"
               name="${id}"
               id="${id}__1"
               class="radio-list__input"
               value="1"
               data-type="${_dataType}"
               data-child-id="${ifDefined(childID)}"
               tabindex="${ifDefined(tabIndex)}"
              ?checked=${value > 0}
              @change=${handler} />
        <label for="${id}__1" class="radio-list__label radio-list__label--short">
          ${inc}
        </label>
      </li>
      <li class="radio-list__item">
        <input type="radio"
               name="${id}"
               id="${id}__-1"
               class="radio-list__input"
               value="-1"
               data-type="${_dataType}"
               data-child-id="${ifDefined(childID)}"
               tabindex="${ifDefined(tabIndex)}"
              ?checked=${value < 0}
              @change=${handler} />
        <label for="${id}__-1" class="radio-list__label radio-list__label--short">
          ${exc}
        </label>
      </li>
    </ul>`;
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
 * Get a single option control for an option filter
 *
 * @param id       ID of wrapper
 * @param option   Option to be controlled
 * @param filters  List of all filter options for a single field
 * @param handler  Event handler for toggle
 * @param inc      Include text
 * @param exc      Exclude text
 * @param tabIndex Tab index (if appropriate)
 *
 * @returns A list item with option toggle
 */
export const getOption = (
  id: string,
  option: IDbEnum,
  filters: Array<IListCtrlOptionItem>,
  handler : FEventHandler,
  inc: string = 'Include',
  exc: string = 'Exclude',
  tabIndex : UTabIndex = undefined
) : TemplateResult => {
  const val = getOptMode(option.id, filters);
  const _id = id + '__' + option.id
  return html`
    <li class="option-list__item" role="radiogroup" aria-labelledby="${_id}--label">
      <span class="option-list__label" id="${_id}--label">${option.name}:</span>
      ${incIgnoreExc(_id , val, handler, option.id, inc, exc, tabIndex)}
    </li>
  `
}

/**
 * Get list of options for field containing values from a fixed list
 * of options
 *
 * @param id              ID of wrapper
 * @param options         Option to be controlled
 * @param filteredOptions List of all filter options for a single
 *                        field
 * @param handler         Event handler for toggle
 * @param inc             Include text
 * @param exc             Exclude text
 * @param tabIndex        Tab index (if appropriate)
 *
 * @returns A list of option toggles
 */
export const getOptions = (
  id: string,
  options: Array<IDbEnum>,
  filteredOptions: Array<IListCtrlOptionItem>,
  handler: FEventHandler,
  inc: string = 'Include',
  exc: string = 'Exclude',
  tabIndex : UTabIndex = undefined
) : TemplateResult => {
  return html`
    <ul class="option-list">
      ${options.map((option : IDbEnum) => getOption(id, option, filteredOptions, handler, inc, exc, tabIndex))}
    </ul>
  `;
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

  console.group('_getOptStr()')

  for (let a = 0; a < filteredOptions.length; a += 1) {
    if (filteredOptions[a].mode !== 0) {
      output += sep + filteredOptions[a].id + ':' + filteredOptions[a].mode;
      sep = ',';
      console.log('output:', output);
    }
  }
  console.log('output:', output);
  console.groupEnd();

  return output;
}


export const helpTxt = () : TemplateResult => {
  return html`
    <ul class="help-block">
      <li>To filter on multiple text fragments, separate each fragment with a semicolon <code>;</code></li>
      <li>To only match from the start, use a caret <code>^</code> at the start of the fragment</li>
      <li>To only match the end, use a dollar sign <code>$</code> at the end of the fragment</li>
      <li>To exclude matched items, preceed your fragment with a exclamation mark <code>!</code> at the end of the fragment</li>
    </ul>
  `;
}

/**
 * Get HTML for a single filter control
 *
 * @param id       ID of wrapper
 * @param label    Label for input
 * @param value    Current value for input
 * @param field    Field input applies to
 * @param data     All the filter control data for the field
 * @param handler  Event handler for toggle
 * @param tabIndex Tab index (if appropriate)
 *
 * @returns HTML for input field
 */
export const getInput = (
  id: string, label: string, value : string|number, field: string, data: IFilterSortCtrl, handler: FEventHandler,
  tabIndex : UTabIndex = undefined
) : TemplateResult => {
  const _id = id + '__' + field;
  let _type : string = data.dataType;
  let _value = value;
  let _special : TemplateResult|string = '';

  if (value === 'auto') {
    switch (field) {
      case 'filter':
        _value = data.filter;
        break;
      case 'bool':
        _value = data.bool;
        break;
    }
  }
  // console.group('_getInput()')
  // console.log('_value:', _value)
  // console.log('_type:', _type)
  // console.log('_id:', _id)

  switch (data.dataType) {
    case 'date':
      _value = (isInt(value) && value > 0)
        ? new Date(value as number).toISOString()
        : '';
      _type = 'date';
      break;

    case 'datetime':
      _value = (isInt(value) && value > 0)
        ? new Date(value as number).toISOString()
        : '';
      _type = 'datetime-local';
      break;

    case 'bool':
      _special = incIgnoreExc(_id, _value as number, handler, undefined, 'Include', 'Exclude', tabIndex);
      break;

    case 'option':
      // console.log('data.options:', data.options)
      _special = getOptions(
        _id,
        data.options as Array<IDbEnum>,
        data.filteredOptions,
        handler,
        'Include',
        'Exclude',
        tabIndex
      );
      break;
  }
  // console.log('_type:', _type)
  // console.groupEnd();

  return html`
    <li>
      <label for="${_id}" class="filter-label">${label}:</label>
      ${(_special === '')
        ? html`<input id="${_id}"
                      type="${_type}"
                      value="${_value}"
                      data-type="${field}"
                      tabindex="${ifDefined(tabIndex)}"
                     @keyup=${handler}
                     @change=${handler}
                      class="filter-input" />`
        : _special
      }
    </li>
  `;
}

/**
 * Get HTML for a checkbox field & label
 *
 * @param id        ID of wrapper
 * @param name      Field name
 * @param isChecked Whether the field is currently checked or not
 * @param trueTxt   Label text for checked state
 * @param falseTxt  Label text for unchecked state
 * @param handler   Event handler for checkbox change
 * @param title     Title attribute for checkbox field
 * @param tabIndex  Tab index (if appropriate)
 *
 * @returns HTML for a checkbox field
 */
export const getToggleInput = (
  id : string,
  name : string,
  isChecked : boolean,
  trueTxt : string,
  falseTxt : string,
  handler : FEventHandler,
  title : string|undefined = undefined,
  tabIndex: number|undefined) : TemplateResult => {
  return html`
    <li>
      <span class="cb-btn__wrap">
        <input
          type="checkbox"
          class="cb-btn__input"
          id="${id}__${name}"
          tabindex="${ifDefined(tabIndex)}"
        ?checked="${isChecked}"
        @change=${handler}
          data-type="${name}"
        />
        <label
          for="${id}__${name}"
          class="cb-btn__label"
          title="${ifDefined(title)}"
          >${(isChecked) ? trueTxt : falseTxt}</label>
      </span>
    </li>
  `;
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
export const getEnumNameByID = (enums : Array<IDbEnum>, id : number) : string => {
  for (let a = 0; a < enums.length; a += 1) {
    if (enums[a].id === id) {
      return enums[a].name
    }
  }

  return '[UNKNOWN]';
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

const doFilter = (listCtrl: IHeadConfig) : boolean => {
  return (listCtrl.isFilter && (
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
const filterSortFilter = (item : UScalarX, listCtrl: Array<IHeadConfig>) : boolean => {
  // console.group('filterSortFilter()');
  // console.log('item:', item)

  for (let a = 0; a < listCtrl.length; a += 1) {
    if (!doFilter(listCtrl[a])) {
      // console.log('listCtrl[' + a + ']:', listCtrl[a])
      // console.log('skipping filter')
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

    let _val = item[ctl.field];
    // console.log('_type:', _type)
    // console.log('_val:', _val)

    switch (ctl.type) {
      case 'text':
        if (_val.toLowerCase().indexOf((ctl.filter as string).toLowerCase()) === -1) {
          // console.groupEnd(); console.groupEnd();
          return false;
        }
        break;

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
          _val = getEnumIdByName(ctl.enumList, _val);
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
const filterSortSort = (items : Array<UScalarX>, listCtrl: Array<IListCtrlItem>) : Array<UScalarX> => {
  if (listCtrl.length === 0) {
    // Nothing to sort so just return input unchanged
    return items;
  }

  // We're trying to be immutable so do a shallow clone
  // This function doesn't touch the children so a shallow
  // clone will be fine.
  const output = [...items];

  output.sort((a : UScalarX, b : UScalarX) => {
    const tmp = [...listCtrl];
    let next = tmp.shift();

    while (typeof next !== 'undefined') {
      const ctl = next;
      next = tmp.shift();
      const _aType = typeof a[ctl.field];
      const _bType = typeof b[ctl.field];

      if (ctl.order === 0) {
        // Sort order is set to Ignore
        continue;
      }

      if (_aType === 'undefined' || _bType === 'undefined') {
        console.log('ctl:', ctl)
        console.log('a:', a)
        console.log('b:', b)
        console.error('one of the items didn\'t have the right field')

        continue;
      } else if (_aType !== _bType) {
        console.log('ctl:', ctl);
        console.log('a:', a);
        console.log('b:', b);
        console.error('type of field in A doesn\'t match type of field in B');

        continue;
      }
      const aVal = a[ctl.field];
      const bVal = b[ctl.field];

      if (aVal < bVal) {
        return ctl.order * -1;
      } else if (aVal > bVal) {
        return ctl.order;
      }
      // everything is the same, so we'll continue on to the next
      // list control item
    }

    // Looks like everything matched so this one stays put
    return 0
  });

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
export const filterAndSort = (items : Array<UScalarX>, listCtrl : Array<IListCtrlItem>) : Array<UScalarX> => {
  return filterSortSort(
    items.filter((item : UScalarX) : boolean => filterSortFilter(item, listCtrl)),
    listCtrl
  );
}

/**
 * Get all filter control data for a single field
 *
 * @param listCtrl List of filter controls
 *
 * @returns Single control if one could be matched. NULL otherwise
 */
export const getFilterData = (listCtrl : Array<IListCtrlItem>) => (field: string) : IListCtrlItem|false => {
  // console.group(getFilterData)
  // console.log('field:', field)
  // console.log('listCtrl:', listCtrl)

  const tmp = listCtrl.filter((item : IListCtrlItem): boolean => item.field === field)

  // console.log('tmp:', tmp)
  // console.groupEnd()
  return (tmp.length === 1)
    ? tmp[0]
    : false;
}

/**
 * Ensure data type is valid
 *
 * @param input Data type to be validated
 *
 * @returns Valid data type
 */
export const getDataType = (input : string) : UDataType => {
  const _input = input.toLowerCase();

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
