import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js'

import { IHeadConfig } from './types/header-config'
// import { IFilterSortCtrl } from './types/IFilterSortCtrl'
import { FEventHandler, IDbEnum, IListCtrlItem, IObjScalarX } from './types/Igeneral';

import { style } from './css/filter-sort-table.css';
import './filter-sort-ctrl';
import './short-date';
import { FilterSortCtrl } from './filter-sort-ctrl';
import { filterAndSort, hasFilteredOpts } from './utilities/filter-sort.utils';
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
   * Whether or not user can toggle column visibility
   */
  @property({ type: Boolean })
  toggleCol : boolean = false;

  /**
   * If links are to be handled in a special way this allows for a
   * custom link click event handler to be used on links
   */
  @property({ attribute: false })
  linkHandler : FEventHandler|undefined = undefined;

  static styles = style;

  @state()
  cols : Array<IHeadConfig> = [];
  @state()
  nonCols : Array<IHeadConfig> = [];

  @state()
  listCtrl : Array<IListCtrlItem> = [];

  // ======================================================
  // Start private methods

  // ------------------------------------------------------
  // START: Initialisation method

  /**
   * Do basic initialisation
   */
  private _doInit() {
    this.doInit = false;
    // console.group('_doInit()')

    this._setCols();

    // console.log('headConfig:', this.headConfig)
    // console.log('cols:', this._cols)
    // console.log('nonCols:', this._nonCols)
    // console.groupEnd()
  }

  /**
   *
   */
  private _setCols() {
    // console.group('_setCols()')
    // console.group('_setCols() - before')
    // console.log('this.cols.length:', this.cols.length)
    // console.log('this.cols:', this.cols)
    // console.log('this.nonCols.length:', this.nonCols.length)
    // console.log('this.nonCols:', this.nonCols)
    // console.groupEnd();

    // Make a list of all the table columns
    this.cols = this.headConfig.filter(
      (col : IHeadConfig) => col.isColumn
      // (col : IHeadConfig) => {
      //   console.log('col.label:', col.label)
      //   console.log('col.isColumn:', col.isColumn)
      //   return col.isColumn
      // }
    );

    // Make a list of all the fields that are filterable but should
    // not be rendered as columns
    this.nonCols = this.headConfig.filter(
      (col : IHeadConfig) => (col.isFilter && !col.isColumn)
    );

    /**
     * Make a list of all the active filters
     */
    this.listCtrl = this.headConfig.filter(
      (col : IHeadConfig) => {
        return (col.isFilter && (col.filter !== '' || col.min !== 0 || col.max !== 0 || col.bool !== 0 || col.filterOnEmpty || col.order !== 0 || hasFilteredOpts(col.options)))
      }
    );
    // console.group('_setCols() - after')
    // console.log('this.cols.length:', this.cols.length)
    // console.log('this.cols:', this.cols)
    // console.log('this.nonCols.length:', this.nonCols.length)
    // console.log('this.nonCols:', this.nonCols)
    // console.groupEnd();
    // console.groupEnd();
  }

  //  END:  Initialisation method
  // ------------------------------------------------------
  // START: Private event handler method


  private _handler(event: Event) : void {
    const filter = event.target as FilterSortCtrl;
    // console.group('filter-sort-table._handler()')
    // console.log('this:', this);
    // console.log('filter.dataType:', filter.dataType);
    // console.log('filter:', filter);
    // console.log('filter.value:', filter.value);
    // console.log('filter.dataset.type:', filter.dataset.type);

    this.headConfig = this.headConfig.map((field: IHeadConfig) : IHeadConfig => {
      if (filter.colName === field.field) {
        const output : IHeadConfig = { ...field }

        switch(filter.dataset.subtype2) {
          case 'order':
            output.order = filter.order;
            break;
          case 'filter':
            output.filter = filter.filter;
            break;
          case 'min':
            output.min = filter.min;
            break;
          case 'max':
            output.max = filter.min;
            break;
          case 'bool':
            output.bool = filter.bool;
            break;
          case 'option':
            output.options = filter.filteredOptions;
            break;
          case 'isCol':
            // console.log('output.isColumn (before):', output.isColumn)
            if (this.toggleCol) {
              output.isColumn = filter.isColumn;
            }
            // console.log('output.isColumn (after):', output.isColumn)
            break;
        }

        return output;
      } else {
        return field;
      }
    })

    this._setCols();

    // this.listCtrl = this.headConfig.filter(item => {

    // }).map((item) : IListCtrlItem => {

    // })
    // console.log('this:', this);
    // console.groupEnd();
  }

  //  END:  Private event handler method
  // ------------------------------------------------------
  // START: Private render methods


  private _renderColHead = (col : IHeadConfig) : TemplateResult => {
    if (col.isFilter === false) {
      return html`
        <th id="${this.id}--${col.field}">${col.label}</th>
      `;
    }

    const options : Array<IDbEnum>|undefined = (Array.isArray(col.enumList) && col.enumList.length > 0)
      ? col.enumList
      : undefined;

    return html`
      <th id="${this.id}--${col.field}" class="filtered-col">
        <filter-sort-ctrl colname="${col.field}"
                          dataType="${col.type}"
                          data-dataType="${col.type}"
                          filter="${col.filter}"
                          min="${col.min}"
                          max="${col.max}"
                          bool="${col.bool}"
                          order="${col.order}"
                          iscolumn="${col.isColumn}"
                         ?togglecol="${this.toggleCol}"
                         .statedata=${col.options}
                         .options=${options}
                         @change=${this._handler}>
          ${col.label}
        </filter-sort-ctrl>
      </th>
    `;
  }


  private _renderCell = (col: IHeadConfig, row : IObjScalarX, index: number) : TemplateResult => {
    // console.group('_renderCell()');
    // console.log('col:', col)
    // console.log('row:', row)
    // console.log('id:', this.id)
    // console.log('index:', index)
    const id = this.id + '--' + index;
    const colID = this.id + '--' + col.field
    let value : TemplateResult|string = (col.type === 'date' || col.type === 'datetime')
      ? html`<short-date timestamp="${row[col.field]}"></short-date>`
      : row[col.field].toString();

    let _class : string|undefined = undefined;
    if (typeof col.urlField === 'string' && col.urlField !== '' && typeof row[col.urlField] === 'string') {
      value = html`<a href="${row[col.urlField]}" @click=${ifDefined(this.linkHandler)}>${value}</a>`;
      _class = 'has-link'

    }

    // console.groupEnd();
    return (index === 0)
      ? html`<th id="${id}" header="${colID}" class="${ifDefined(_class)}">${value}</th>`
      : html`<td headers="${id} ${colID}" class="${ifDefined(_class)}">${value}</td>`;
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
        ${this.cols.map(
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
            ${this.cols.map(
              (col : IHeadConfig) => this._renderColHead(col)
            )}
          </tr>
        </thead>
        <tbody>
          ${repeat(filterAndSort(this.listData, this.listCtrl), item => item.id, this._renderRow)}
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
