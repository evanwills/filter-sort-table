import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js'

import { IHeadConfig } from './types/header-config'
import { FEventHandler, IDbEnum, IObjArrStrSimple, IObjScalarX, UScalar } from './types/Igeneral';

import { style } from './css/filter-sort-table.css';

import { filterAndSort, getDataType, setSortOrder, skipFilter } from './utilities/filter-sort.utils';
import { isInt, isNumber } from './utilities/validation';
import { isTrue } from './utilities/sanitise';

import { FilterSortCtrl } from './filter-sort-ctrl';
import { ShortDate } from './short-date';

import './filter-sort-ctrl';
import './short-date';

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
  tableData : Array<IObjScalarX> = [];

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
    if (this.html) {
      // console.log('parsing HTML table');
      this._extractHeadConfig();
      this._extractTableData();
    }

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


  /**
   * Generic event handler for handing all changes to filter controls
   *
   * @param event User triggered change event
   */
  private _handler(event: Event) : void {
    const filter = event.target as FilterSortCtrl;
    console.group('filter-sort-table._handler()')
    // console.log('this:', this);
    // console.log('filter.dataType:', filter.dataType);
    // console.log('filter:', filter);
    // console.log('filter.value:', filter.value);
    // console.log('filter.dataset.type:', filter.dataset.type);
    let resetOrder = false

    this.headConfig = this.headConfig.map((field: IHeadConfig) : IHeadConfig => {
      if (filter.colName === field.field) {
        const output : IHeadConfig = { ...field }

        switch(filter.dataset.subtype2) {
          case 'order':
            resetOrder = true;
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
            output.skip = (output.bool !== 0);
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
        console.log('output:', output);
        output.skip = skipFilter(output);
        console.log('output:', output);

        return output;
      } else {
        return field;
      }
    })

    this._setCols();
    if (resetOrder) {
      this.headConfig = setSortOrder(this.headConfig, filter.colName, filter.order);
    }

    // this.listCtrl = this.headConfig.filter(item => {

    // }).map((item) : IListCtrlItem => {

    // })
    console.log('this:', this);
    console.groupEnd();
  }


  //  END:  Private event handler method
  // ------------------------------------------------------
  // START: Methods for extracting data from HTML table


  /**
   * Extract column header data from <TH> & <TD> elements in a
   * table's <THEAD>
   */
  private _extractHeadConfig = () : void => {
    // console.log('this:', this)
    const cols : NodeListOf<HTMLTableCellElement> = this.querySelectorAll('thead > tr:last-child > *')
    // console.log('cols:', cols)
    const output : Array<IHeadConfig> = [];

    for (let a = 0; a < cols.length; a += 1) {
      const col = cols[a] as HTMLElement;
      // console.log('cols[' + a + ']:', cols[a])

      const tmp : IHeadConfig = {
        label: (col.innerHTML === col.innerText)
          ? col.innerText.trim()
          : col.innerHTML,
        isColumn: true,
        isFilter: (typeof col.dataset.datatype === 'string'  && col.dataset.datatype.trim() !== ''),
        type: (typeof col.dataset.datatype === 'string' && col.dataset.datatype !== '')
          ? getDataType(col.dataset.datatype)
          : 'text',
        field: (typeof col.dataset.colname === 'string')
          ? col.dataset.colname
          : col.id,
        filter: '',
        min: 0,
        max: 0,
        bool: 0,
        options: [],
        order: 0,
        orderByValue: false,
        orderPriority: -1,
        filterOnEmpty: false,
        skip: true
      }

      if (tmp.type === 'option' && typeof col.dataset.enumlist === 'string' && col.dataset.enumlist !== '') {
        const enums = col.dataset.enumlist.split(',');
        const enumList : Array<IDbEnum> = [];
        for (let b = 0; b < enums.length; b += 1) {
          const _enum = enums[b].split(':');
          if (_enum.length === 2 && isInt(_enum[0])) {
            enumList.push({
              id: parseInt(_enum[0]),
              name: _enum[1],
              description: ''
            })
          }
        }
      }
      tmp.field = tmp.field.trim();

      if (tmp.field === '') {
        tmp.isFilter = false
        tmp.field = col.innerText.trim().replace(/\s+/g, '-');
      }

      output.push(tmp);
    }

    this.headConfig = output;
  }

  /**
   * Extract row data from a cells with a table row
   */
  private _extractTableData = () : void => {
    const output : Array<IObjScalarX> = [];

    const rows : NodeListOf<HTMLTableRowElement> = this.querySelectorAll('tbody > tr');
    const options : IObjArrStrSimple = {};
    this.tableData = [];

    for (let a = 0; a < rows.length; a += 1) {
      const tmp : IObjScalarX = {};
      // console.log('rows[' + a + '].children', rows[a].children)

      for (let b = 0; b < this.headConfig.length; b += 1) {
        const ctrlItem : IHeadConfig = this.headConfig[b];
        if (typeof rows[a].children[b] !== 'undefined') {
          let _val : UScalar = rows[a].children[b].innerText.trim().replace(/\s+/g, ' ');
          // console.log('rows[' + a + '].children[' + b + ']:', rows[a].children[b])

          switch (this.headConfig[b].type) {
            case 'date':
            case 'datetime':
              if (typeof rows[a].children[b].children !== 'undefined' && typeof rows[a].children[b].children[0] !== 'undefined') {
                // console.log('rows[' + a + '].children[' + b + '].children[0]:', rows[a].children[b].children[0])
                // console.log('rows[' + a + '].children[' + b + '].children[0].tagName:', rows[a].children[b].children[0].tagName)
                if (rows[a].children[b].children[0].tagName === 'SHORT-DATE') {
                  _val = (rows[a].children[b].children[0] as ShortDate).timestamp;
                }
              } else {
                const _tmp = new Date(_val as string);
                if (_tmp.toString() !== 'Invalid Date') {
                  _val = (_tmp.getTime() / 1000);
                }

              }
              break;

            case 'bool':
              _val = isTrue(_val);
              break;

            case 'number':
              _val = isNumber(_val)
                ? parseFloat(_val as string)
                : _val;
              break;

            case 'option':
              if (typeof ctrlItem.enumList === 'undefined') {
                if (typeof options[ctrlItem.field] === 'undefined') {
                  options[ctrlItem.field] = [];
                }
                if (options[ctrlItem.field].indexOf(_val as string) === -1) {
                  options[ctrlItem.field].push(_val as string)
                }
              }

          }

          tmp[this.headConfig[b].field] = _val;
        }

      }
      output.push(tmp);
      // console.log('cols[' + a + ']', cols[a])
    }

    // Add enums for fixed option columns
    this.headConfig = this.headConfig.map((item: IHeadConfig) : IHeadConfig => {
      if (item.type === 'option' && typeof item.enumList === 'undefined' && typeof options[item.field] !== 'undefined') {
        item.enumList = options[item.field].map(
          (name: string, index: number) : IDbEnum => {
            return {
              id: index + 1,
              name: name,
              description: ''
            }
          }
        )
      }
      return item;
    })

    this.tableData = output;
  }


  //  END:  Methods for extracting data from HTML table
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


  private _renderCell = (col: IHeadConfig, row : IObjScalarX, rowIndex: number, colIndex: number) : TemplateResult => {
    // console.group('_renderCell()');
    // console.log('col:', col)
    // console.log('row:', row)
    // console.log('id:', this.id)
    // console.log('index:', index)
    const id = this.id + '--' + rowIndex;
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
    return (colIndex === 0)
      ? html`<th id="${id}" header="${colID}" class="${ifDefined(_class)}">${value}</th>`
      : html`<td headers="${id} ${colID}" class="${ifDefined(_class)}">${value}</td>`;
  }

  /**
   * Render a single table row
   *
   * @param row   Data for a single row in a table
   * @param index Index of the row being rendered
   *
   * @returns HTML table body row
   */
  private _renderRow = (row : IObjScalarX, rowIndex : number) : TemplateResult => {
    return html`
      <tr>
        ${this.cols.map(
          (col : IHeadConfig, colIndex: number) => this._renderCell(col, row, rowIndex, colIndex)
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

    // const data = filterAndSort(this.tableData, this.)

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
          ${repeat(filterAndSort(this.tableData, this.headConfig), item => item.id, this._renderRow)}
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
