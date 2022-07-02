import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { customElement, property, state } from 'lit/decorators.js';

import { IHeadConfig } from './types/header-config'
// import { IFilterSortCtrl } from './types/IFilterSortCtrl'
import { FEventHandler, IDbEnum, IListCtrlItem, IObjScalarX } from './types/Igeneral';

import { style } from './css/filter-sort-table.css';
import './filter-sort-ctrl';
import './short-date';
import { FilterSortCtrl } from './filter-sort-ctrl';
// import { getBoolState } from './utilities/general.utils';
// import { filterAndSort, filterSortSort } from './utilities/filter-sort.utils';
// import { getNum } from './utilities/sanitise';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('filter-sort-table')
export class FilterSortTable extends LitElement {
  @property()
  headConfig : Array<IHeadConfig> = [];

  @property()
  listData : Array<IObjScalarX> = [];

  @property({ type: Boolean })
  html : boolean = false;

  /**
   * Whether or not to do intialisation stuff
   */
  @property({ type: Boolean })
  doInit : boolean = true;

  /**
   * If links are to be handled in a special way this allows for a
   * custom link click event handler to be used on links
   */
  @property({ attribute: false })
  linkHandler : FEventHandler|undefined = undefined;

  static styles = style;

  private _cols : Array<IHeadConfig> = [];
  private _nonCols : Array<IHeadConfig> = [];

  @state()
  listCtrl : Array<IListCtrlItem> = [];

  // ======================================================
  // Start private methods

  // ------------------------------------------------------
  // START: Initialisation method

  private _doInit() {
    this.doInit = false;
    // console.group('_doInit()')

    this._setCols();

    // console.log('headConfig:', this.headConfig)
    // console.log('cols:', this._cols)
    // console.log('nonCols:', this._nonCols)
    // console.groupEnd()
  }

  private _setCols() {
    this._cols = this.headConfig.filter(
      (col : IHeadConfig) => col.isColumn
    );
    this._nonCols = this.headConfig.filter(
      (col : IHeadConfig) => !col.isColumn
    );
  }

  //  END:  Initialisation method
  // ------------------------------------------------------
  // START: Private event handler method


  private _changeHandler(event: Event) : void {
    const filter = event.target as FilterSortCtrl;
    console.group('_changeHandler()')

    this.headConfig.map((field: IHeadConfig) : IHeadConfig => {
      if (filter.colName === field.prop) {
        const output : IHeadConfig = { ...field }

        if (typeof output.ctrl === 'undefined') {
          // This should never happent but just in case...
          output.ctrl = {
            field: output.prop,
            type: (typeof output.type === 'string')
              ? output.type
              : 'text',
            filterOnEmpty: false,
            filter: '',
            min: 0,
            max: 0,
            bool: 0,
            options: [],
            order: 0,
            orderByValue: false
          }
        }

        console.log('filter:', filter)
        switch(filter.dataset.subtype2) {
          case 'order':
            output.ctrl.order = filter.order;
            break;
          case 'filter':
            output.ctrl.filter = filter.filter;
            break;
          case 'min':
            output.ctrl.min = filter.min;
            break;
          case 'max':
            output.ctrl.max = filter.min;
            break;
          case 'bool':
            output.ctrl.bool = filter.bool;
            break;
          case 'option':
            output.ctrl.options = filter.filteredOptions;
            break;
          case 'isCol':
            output.isColumn = !output.isColumn;
            this._setCols();
            break;
        }

        console.groupEnd()
        return output;
      } else {
        console.groupEnd()
        return field;
      }
    })

    // this.listCtrl = this.headConfig.filter(item => {

    // }).map((item) : IListCtrlItem => {

    // })
  }

  //  END:  Private event handler method
  // ------------------------------------------------------
  // START: Private render methods


  private _renderColHead = (col : IHeadConfig) : TemplateResult => {
    if (typeof col.ctrl === 'undefined') {
      return html`
        <th id="${this.id}--${col.prop}">${col.label}</th>
      `;
    }

    const _col = col.ctrl

    const options : Array<IDbEnum>|undefined = (Array.isArray(col.enumList) && col.enumList.length > 0)
      ? col.enumList
      : undefined;

    return html`
        <th id="${this.id}--${_col.field}">
          <filter-sort-ctrl colname="${_col.field}"
                            dataType="${_col.type}"
                            data-dataType="${_col.type}"
                            filter="${_col.filter}"
                            min="${_col.min}"
                            max="${_col.max}"
                            bool="${_col.bool}"
                           .statedata=${_col.options}
                            order="${_col.order}"
                           .options=${options}
                           @change=${this._changeHandler}>
            ${col.label}
          </filter-sort-ctrl>
        </th>
        `
  }


  private _renderCell = (col: IHeadConfig, row : IObjScalarX, index: number) : TemplateResult => {
    // console.group('_renderCell()');
    // console.log('col:', col)
    // console.log('row:', row)
    // console.log('id:', this.id)
    // console.log('index:', index)
    const _type = typeof col.ctrl !== 'undefined'
      ? col.ctrl.type
      : (typeof col.type === 'string')
        ? col.type
        : 'text';
    const id = this.id + '--' + index;
    const colID = this.id + '--' + col.prop
    let value : TemplateResult|string = (_type === 'date' || _type === 'datetime')
      ? html`<short-date timestamp="${row[col.prop]}"></short-date>`
      : row[col.prop].toString();

    value = (typeof col.urlField === 'string' && col.urlField !== '' && typeof row[col.urlField] === 'string')
      ? html`<a href="${row[col.urlField]}" @click=${ifDefined(this.linkHandler)}>${value}</a>`
      : value
    // console.groupEnd();
    return (index === 0)
      ? html`<th id="${id}" header="${colID}">${value}</th>`
      : html`<td headers="${id} ${colID}">${value}</td>`;
  }

  /**
   * Render a single table row
   *
   * @param row data for a single row in a table
   *
   * @returns HTML table body row
   */
  private _renderRow = (row : IObjScalarX) : TemplateResult => {
    return html`
      <tr>
            ${this._cols.map(
              (col : IHeadConfig, index: number) => this._renderCell(col, row, index)
            )}
      </tr>
    `;
  }

  //  END:  Private render methods
  // ------------------------------------------------------

  //  END:  private methods
  // ======================================================
  // START: Public methods

  render() {
    if (this.doInit === true) {
      this._doInit();
    }

    // const data = filterAndSort(this.listData, this.)

    return html`
      <table>
        <thead>
          <tr>
            ${this._cols.map(
              (col : IHeadConfig) => this._renderColHead(col)
            )}
          </tr>
        </thead>
        <tbody>
          ${this.listData.map(row => this._renderRow(row))}
        </tbody>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'filter-sort-table': FilterSortTable
  }
}
