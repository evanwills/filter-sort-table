import { html, TemplateResult } from 'lit';
// import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { UBoolState, FEventHandler, IDbEnum, IListCtrlOptionItem, IListCtrlItem, UDataType } from '../types/Igeneral';

import { isInt, isNumber } from './validation';
// import { isoStrToTime } from './sanitise';
import { getBoolState } from './general.utils';
import { IFilterSortCtrl } from '../types/IFilterSortCtrl';
import { UScalarX } from '../types/Igeneral';


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

export const incIgnoreExc = (
  id: string,
  value: number,
  handler : FEventHandler,
  childID: number|undefined = undefined,
  inc: string = 'Include',
  exc: string = 'Exclude'
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
              ?checked=${value < 0}
              @change=${handler} />
        <label for="${id}__-1" class="radio-list__label radio-list__label--short">
          ${exc}
        </label>
      </li>
    </ul>`;
}

export const getOptMode = (
  id: number, filters: Array<IListCtrlOptionItem>
) : UBoolState => {
  const filter = filters.filter((item: IListCtrlOptionItem) => (item.id === id));
  return (filter.length === 1)
    ? filter[0].mode
    : 0
}

export const getOption = (
  id: string,
  option: IDbEnum,
  filters: Array<IListCtrlOptionItem>,
  handler : FEventHandler,
  inc: string = 'Include',
  exc: string = 'Exclude'
) : TemplateResult => {
  const val = getOptMode(option.id, filters);
  return html`
    <li>
      ${option.name}:
      ${incIgnoreExc(id + '__' + option.id , val, handler, option.id, inc, exc)}
    </li>
  `
}

export const getOptions = (
  id: string,
  options: Array<IDbEnum>,
  filteredOptions: Array<IListCtrlOptionItem>,
  handler: FEventHandler,
  inc: string = 'Include',
  exc: string = 'Exclude'
) : TemplateResult => {
  return html`
    <ul>
      ${options.map((option : IDbEnum) => getOption(id, option, filteredOptions, handler, inc, exc))}
    </ul>
  `;
}


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

export const getInput = (
  id: string, label: string, value : string|number, field: string, data: IFilterSortCtrl, handler: FEventHandler
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
      _special = incIgnoreExc(_id, _value as number, handler);
      break;

    case 'option':
      // console.log('data.options:', data.options)
      _special = getOptions(
        _id,
        data.options as Array<IDbEnum>,
        data.filteredOptions,
        handler
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
                     @keyup=${handler}
                     @change=${handler}
                      class="filter-input" />`
        : _special
      }
    </li>
  `;
}

export const getToggleInput = (
  id : string,
  name : string,
  isChecked : boolean,
  trueTxt : string,
  falseTxt : string,
  handler : FEventHandler,
  title : string|undefined = undefined) : TemplateResult => {
  return html`
    <li>
      <span class="cb-btn__wrap">
        <input
          type="checkbox"
          class="cb-btn__input"
          id="${id}__${name}"
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
      (exc.length > 0 && inc.indexOf(id) > -1)
  ) {
    return false;
  }
  else return true;
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
const filterSortFilter = (item : UScalarX, listCtrl: Array<IListCtrlItem>) : boolean => {
  for (let a = 0; a < listCtrl.length; a += 1) {
    const ctl = listCtrl[a];
    const _type = typeof item[ctl.field];

    if (_type === 'undefined') {
        throw new Error(
        'Cannot filter on `' + ctl.field + '` if item does contain that property'
      );
    }

    let _val = item[ctl.field];

    switch (ctl.type) {
      case 'text':
        if (_val.toLowerCase().indexOf(ctl.filter.toLowerCase()) === -1) {
          return false;
        }
        break;

      case 'number':
        if (_type !== 'number') {
          throw new Error(
              'Cannot filter on `' + ctl.field + '` because item.' +
              ctl.field + ' is not a number'
          );
        }

        if (ctl.min !== 0 || ctl.max !== 0) {
          if (ctl.min > _val || ctl.max < _val) {
            console.groupEnd(); console.groupEnd();
            return false;
          }
        } else if (_val !== parseFloat(ctl.filter)) {
          return false;
        }
        break;

      case 'bool':
        if (_type !== 'boolean') {
          throw new Error(
            'Cannot filter on `' + ctl.field + '` because item.' +
            ctl.field + ' is not boolean'
          );
        }
        if ((ctl.bool === 1 && _val === false)
          || (ctl.bool === -1 && _val === true)
        ) {
          return false;
        }

        break;

      case 'option':
        if (_type !== 'number') {
          throw new Error(
              'Cannot filter on `' + ctl.field + '` because item.' +
              ctl.field + ' is not a number'
          );
        }
        if (filterOnOptions(ctl.options, _val as number) === false) {
          return false;
        }
    }
  }

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
