import { html, TemplateResult } from 'lit';

import { ifDefined } from 'lit/directives/if-defined.js';

import { FEventHandler, UTabIndex } from '../types/Igeneral';

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
 * Get buttons that can be using for moving something one space
 * relative to its current position
 *
 * @param id        ID of thing to be moved
 * @param label     Label of thing to be moved
 * @param isTop     Whether item is at the top of its list
 * @param isBottom  Whether item is at the bottom of its list
 * @param handler   Event handler callback function
 * @param tabIndex  Tabindex of buttons.
 *                  `undefined` if buttons are visible
 *                  -1 if buttons are hidden
 * @param leftRight Whether or not the movement is left/right (or up/down)
 * @param childID   If item is a child item, this is the ID of the
 *                  child item.
 *
 * @returns If item is not BOTH top & bottom of its list, a template
 *          with one or two move buttons is returned. Otherwise an
 *          empty string is returned
 */
 export const getMoveBtns = (
  id: string|number,
  label: string,
  isTop: boolean,
  isBottom: boolean,
  handler : FEventHandler,
  tabIndex: UTabIndex = undefined,
  leftRight: boolean = false,
  childID: string|number|undefined = undefined
) : TemplateResult|string => {
  const up = (leftRight === true)
    ? 'left'
    : 'up'
  const down = (leftRight === true)
    ? 'right'
    : 'down'

  const mod = (leftRight === true)
    ? 'horizontal'
    : 'vertical';

  return (!isTop || !isBottom)
    ? html`
        <span class="move-btn__wrap move-btn__wrap--${mod}" role="group">
          ${(!isTop)
            ? html`
                <button value="${up}"
                        class="move-btn move-btn--${up} focusable"
                        data-type="${id}"
                        data-childid="${ifDefined(childID)}"
                       @click=${handler}
                        tabindex="${ifDefined(tabIndex)}"
                        title="Move ${label} ${up}">
                  <span class="sr-only">Move ${label} ${up}</span>
                </button>`
            : ''
          }
          ${(!isBottom)
            ? html`
                <button value="${down}"
                        class="move-btn move-btn--${down} focusable"
                        data-type="${id}"
                        data-childid="${ifDefined(childID)}"
                       @click=${handler}
                        tabindex="${ifDefined(tabIndex)}"
                        title="Move ${label} ${down}">
                  <span class="sr-only">Move ${label} ${down}</span>
                </button>`
            : ''
          }
        </span>
      `
    : '';
}
