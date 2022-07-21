import { html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { IFilterSortCtrl } from "../types/IFilterSortCtrl";
import { FEventHandler, IDbEnum, IListCtrlOptionItem, UTabIndex } from "../types/Igeneral";
import { getOptMode } from "./filter-sort.utils";
import { isInt } from "./validation";



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
      if (field === 'filter') {
        field = 'min';
      }
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
  tabIndex: number|undefined
) : TemplateResult => {
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
    <ul class="radio-list__wrap radio-list__wrap--short" role="radiogroup">
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
export const getSortBtns = (
  id: string,
  value: number,
  handler : FEventHandler,
  childID: number|undefined = undefined,
  label: string,
  tabIndex: UTabIndex = undefined,
) : TemplateResult  => {
  const _val = (value === 0 || value === -1 || value === 1)
    ? value
    : 0
  // console.group('_incIgnoreExc()')
  // console.log('id:', id)
  // console.log('value:', value)
  // console.log('isInt(value):', isInt(value))
  // console.log('field:', field)
  // console.log('data.stateData:', data.stateData)
  // console.groupEnd();
  return html`
    <ul class="radio-sort__wrap" role="radiogroup">
      <li class="radio-sort__item">
        <input type="radio"
               name="${id}"
               id="${id}__sort__1"
               class="radio-sort__input"
               value="1"
               data-type="sort"
               data-child-id="${ifDefined(childID)}"
               tabindex="${ifDefined(tabIndex)}"
              ?checked=${_val === 1}
              @change=${handler} />
        <label for="${id}__sort__1" class="radio-sort__label radio-sort__label--up focusable-label" title="Ascending order">
          <span class="sr-only">Sort by ${label} ascending</span>
        </label>
      </li>
      <li class="radio-sort__item">
        <input type="radio"
               name="${id}"
               id="${id}__sort__0"
               class="radio-sort__input"
               value="0"
               data-type="sort"
               data-child-id="${ifDefined(childID)}"
               tabindex="${ifDefined(tabIndex)}"
              ?checked=${_val === 0}
              @change=${handler} />
        <label for="${id}__sort__0" class="radio-sort__label radio-sort__label--ignore focusable-label" title="No order">
          <span class="sr-only">Do not sort by ${label}</span>
        </label>
      </li>
      <li class="radio-sort__item">
        <input type="radio"
               name="${id}"
               id="${id}__sort__-1"
               class="radio-sort__input"
               value="-1"
               data-type="sort"
               data-child-id="${ifDefined(childID)}"
               tabindex="${ifDefined(tabIndex)}"
              ?checked=${_val === -1}
              @change=${handler} />
        <label for="${id}__sort__-1" class="radio-sort__label radio-sort__label--down focusable-label" title="Decending order">
          <span class="sr-only">Sort by ${label} decending</span>
        </label>
      </li>
    </ul>`;
}

/**
 *
 * @param id       ID of thing to be moved
 * @param label    Label of thing to be moved
 * @param isTop    Whether item is at the top of its list
 * @param isBottom Whether item is at the bottom of its list
 * @param handler  Event handler callback function
 * @param tabIndex Tabindex of buttons.
 *                 `undefined` if buttons are visible
 *                 -1 if buttons are hidden
 * @param childID  If item is a child item, this is the ID of the
 *                 child item.
 *
 * @returns If item is not BOTH top & bottom of its list, a template
 *          with one or two move buttons is returned. Otherwise an
 *          empty string is returned
 */
export const getExportMoveBtns = (
  id: string|number,
  label: string,
  isTop: boolean,
  isBottom: boolean,
  handler : FEventHandler,
  tabIndex: UTabIndex = undefined,
  childID: number|undefined = undefined
) : TemplateResult|string => {
  return (!isTop || !isBottom)
    ? html`
        <span class="move-btn__wrap" role="group">
          ${(!isTop)
            ? html`
                <button value="up"
                        class="move-btn move-btn--up focusable"
                        data-type="${id}"
                        data-childid="${ifDefined(childID)}"
                       @click=${handler}
                        tabindex="${ifDefined(tabIndex)}"
                        title="Move ${label} up">
                  <span class="sr-only">Move ${label} up</span>
                </button>`
            : ''
          }
          ${(!isBottom)
            ? html`
                <button value="down"
                        class="move-btn move-btn--down focusable"
                        data-type="${id}"
                        data-childid="${ifDefined(childID)}"
                       @click=${handler}
                        tabindex="${ifDefined(tabIndex)}"
                        title="Move ${label} down">
                  <span class="sr-only">Move ${label} down</span>
                </button>`
            : ''
          }
        </span>
      `
    : '';
}

/**
 *
 * @param label    Label of thing to be moved
 * @param isFirst  Whether item is at the top of its list
 * @param isLast   Whether item is at the bottom of its list
 * @param handler  Event handler callback function
 * @param tabIndex Tabindex of buttons.
 *                 `undefined` if buttons are visible
 *                 -1 if buttons are hidden
 * @param childID  If item is a child item, this is the ID of the
 *                 child item.
 *
 * @returns If item is not BOTH top & bottom of its list, a template
 *          with one or two move buttons is returned. Otherwise an
 *          empty string is returned
 */
 export const getColMoveBtns = (
  label: string,
  isFirst: boolean,
  isLast: boolean,
  handler : FEventHandler,
  tabIndex: UTabIndex = undefined,
  childID: number|undefined = undefined
) : TemplateResult|string => {
  return (!isFirst || !isLast)
    ? html`
        <span class="move-btn__wrap move-btn__wrap--column" role="group">
          ${(!isFirst)
            ? html`
                <button value="left"
                        class="move-btn move-btn--left focusable"
                        data-type="move"
                        data-childid="${ifDefined(childID)}"
                       @click=${handler}
                        tabindex="${ifDefined(tabIndex)}"
                        title="Move ${label} left">
                  <span class="sr-only">Move ${label} left</span>
                </button>`
            : ''
          }
          ${(!isLast)
            ? html`
                <button value="right"
                        class="move-btn move-btn--right focusable"
                        data-type="move"
                        data-childid="${ifDefined(childID)}"
                       @click=${handler}
                        tabindex="${ifDefined(tabIndex)}"
                        title="Move ${label} right">
                  <span class="sr-only">Move ${label} right</span>
                </button>`
            : ''
          }
        </span>
      `
    : '';
}
