import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js'

import { IHeadConfig, IHeadConfigInternal } from './types/header-config'
import { FEventHandler, IDbEnum, IListCtrlItem, IObjArrStrSimple, IObjScalarX, UScalar } from './types/Igeneral';

import { style } from './css/filter-sort-table.css';

import { convertSep, filterAndSort, getDataType, getExportDataURL, getToggleInput, headConfigToListCtrl, moveExportCol, setExportColOrder, setSortOrder, skipFilter, sortExportCols } from './utilities/filter-sort.utils';
import { isInt, isNumber } from './utilities/validation';
import { isTrue } from './utilities/sanitise';

import { FilterSortCtrl } from './filter-sort-ctrl';
import { ShortDate } from './short-date';

import './filter-sort-ctrl';
import './short-date';
import { getBoolState } from './utilities/general.utils';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('filter-sort-table')
export class FilterSortTable extends LitElement {
  @property()
  headConfig : Array<IHeadConfig|IHeadConfigInternal> = [];

  @property()
  tableData : Array<IObjScalarX> = [];

  @property({ type: Boolean })
  html : boolean = false;

  @property({ type: String, reflect: true })
  lastFiltered: string = '';

  /**
   * Character(s) used to separate columns in export
   */
  @property({ type: String, reflect: true })
  colSeperator: string = '\t';

  /**
   * Character(s) used to separate export rows
   */
  @property({ type: String, reflect: true })
  rowSeperator: string = '\n';

  /**
   * Whether or not to do intialisation stuff
   */
  @property({ type: Boolean })
  allowExport : boolean = false;

  /**
   * Whether or not omit export column headers
   */
  @property({ type: Boolean })
  omitHeaders : boolean = false;

  /**
   * Whether or not omit export column headers
   */
  @property({ type: String })
  fileName : string = 'file.tsv';

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
  showExtra : boolean = false;
  @state()
  showExport : boolean = false;

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

    this.headConfig = setExportColOrder(
      this.headConfig.map(
        (item : IHeadConfig) : IHeadConfigInternal => {
          return {
            ...item,
            skip: skipFilter(item)
          }
        }
      )
    );

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
  // START: Methods for extracting data from HTML table


  /**
   * Extract column header data from <TH> & <TD> elements in a
   * table's <THEAD>
   */
  private _extractHeadConfig = () : void => {
    // console.log('this:', this)
    const cols : NodeListOf<HTMLTableCellElement> = this.querySelectorAll('thead > tr:last-child > *')
    // console.log('cols:', cols)
    const output : Array<IHeadConfigInternal> = [];

    for (let a = 0; a < cols.length; a += 1) {
      const col = cols[a] as HTMLElement;
      // console.log('cols[' + a + ']:', cols[a])

      const tmp : IHeadConfigInternal = {
        label: (col.innerHTML === col.innerText)
          ? col.innerText.trim()
          : col.innerHTML,
        isColumn: true,
        isFilter: (typeof col.dataset.type === 'string'  && col.dataset.type.trim() !== ''),
        type: (typeof col.dataset.type === 'string' && col.dataset.type.trim() !== '')
          ? getDataType(col.dataset.type)
          : 'text',
        field: (typeof col.dataset.field === 'string')
          ? col.dataset.field
          : col.id,
        filter: (typeof col.dataset.filter === 'string')
          ? col.dataset.filter
          : '',
        min: (typeof col.dataset.min === 'string' && isNumber(col.dataset.min))
          ? parseFloat(col.dataset.min)
          : 0,
        max: (typeof col.dataset.max === 'string' && isNumber(col.dataset.max))
          ? parseFloat(col.dataset.max)
          : 0,
        bool: (typeof col.dataset.bool === 'string' && isNumber(col.dataset.bool))
          ? getBoolState(col.dataset.bool)
          : 0,
        options: [],
        order: (typeof col.dataset.order === 'string' && isNumber(col.dataset.order))
          ? getBoolState(col.dataset.order)
          : 0,
        orderByValue: (typeof col.dataset.orderByValue !== 'undefined'),
        orderPriority: (typeof col.dataset.orderPriority === 'string' && isNumber(col.dataset.orderPriority))
          ? parseInt(col.dataset.orderPriority)
          : -1,
        filterOnEmpty: (typeof col.dataset.orderPriority !== 'undefined'),
        export: (typeof col.dataset.export !== 'undefined'),
        exportOrder: (typeof col.dataset.exportOrder === 'string')
          ? parseInt(col.dataset.exportOrder)
          : -1,
        skip: true
      }

      if (tmp.type === 'option' && typeof col.dataset.optionlist === 'string' && col.dataset.optionlist !== '') {
        const enums = col.dataset.optionlist.split(',');
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
          let _val : UScalar = (rows[a].children[b] as HTMLTableCellElement).innerText.trim().replace(/\s+/g, ' ');
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
  // START: Private event handler methods


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

    this.headConfig = this.headConfig.map(
      (field: IHeadConfig|IHeadConfigInternal) : IHeadConfigInternal => {
        if (filter.colName === field.field) {
          const output : IHeadConfigInternal = { ...field, skip: true }

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
              output.max = filter.max;
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
          // console.log('output:', output);
          output.skip = skipFilter(output);
          // console.log('output:', output);
          this.lastFiltered = filter.colName;

          return output;
        } else {
          return (typeof field.skip === 'boolean')
            ? field as IHeadConfigInternal
            : { ...field, skip: skipFilter(field) };
        }
      }
    )

    this._setCols();
    if (resetOrder) {
      this.headConfig = setSortOrder(this.headConfig, filter.colName, filter.order);
    }

    this.dispatchEvent(
      new Event('change', { bubbles: true, composed: true })
    );
    console.log('this:', this);
    console.groupEnd();
  }

  private _download(_event: Event) : void {
    // _event.preventDefault();
    const link = _event.target as HTMLLinkElement;
    const data = getExportDataURL(
      this.tableData, this.headConfig,
      this.colSeperator, this.rowSeperator, !this.omitHeaders
    );

    if (data !== '') {
      link.href = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURI(data);
      link.download = this.fileName;
      link.target = '_blank';

    }

  }

  /**
   * Toggle show/hide status modal UI
   *
   * @param event User triggered click event
   */
  private _toggleModal(event: Event) : void {
    // _event.preventDefault();
    const btn = event.target as HTMLButtonElement;

    switch (btn.value) {
      case 'extra':
        this.showExtra = !this.showExtra;
        break;

      case 'export':
        this.showExport = !this.showExport;
        break;

      case 'up':
      case 'down':
        this.headConfig = moveExportCol(
          this.headConfig, btn.dataset.type as string, btn.value
        );

        this.lastFiltered = btn.dataset.type as string;
        this.dispatchEvent(
          new Event('change', { bubbles: true, composed: true })
        );
        break;
    }
  }

  /**
   * Toggle include/omit status of column in export
   *
   * @param event User triggered click event
   */
  private _toggleExportCol(event: Event) : void {
    const cb = event.target as HTMLInputElement;
    let hasChanged = false;

    this.headConfig = this.headConfig.map((col: IHeadConfig) : IHeadConfig => {
      if (col.field === cb.dataset.type) {
        hasChanged = true;
        return {
          ...col,
          export: !col.export
        }
      } else {
        return col;
      }
    });

    if (hasChanged) {
      this.lastFiltered = cb.dataset.type as string;
      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
    }
  }

  private _updateSep(event: Event) : void {
    const input = event.target as HTMLInputElement;
    let hasChanged = false;

    switch (input.dataset.type) {
      case 'column':
        this.colSeperator = convertSep(input.value, false);
        this.lastFiltered = 'column-sep';
        hasChanged = true;
        break;

      case 'row':
        this.rowSeperator = convertSep(input.value, false);
        this.lastFiltered = 'row-sep';
        hasChanged = true;
        break;
    }

    if (hasChanged) {
      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
    }
    console.log('this:', this)
  }


  //  END:  Private event handler methods
  // ------------------------------------------------------
  // START: Private render methods


  /**
   * Render a table header column header
   *
   * @param col Data for a single column header with (or without)
   *            filter control
   *
   * @returns HTML table column header
   */
  private _renderColHead(col : IHeadConfig) : TemplateResult {
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
                          label="${col.label}"
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

  /**
   * Render a single table cell
   *
   * @param col      Filter control data for column
   * @param row      Data for whole row
   * @param rowIndex Index of the row
   * @param colIndex Index of the individual cell being rendered
   *
   * @returns A single HTML <TD> or <TH> cell
   */
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

  /**
   * Render filter controls for hidden fields
   *
   * @returns A list of filter controls for fields that are not
   *          rendered as columns
   */
  private _renderExtraFilters = () : TemplateResult|string => {
    if (this.nonCols.length === 0) {
      return '';
    }

    const show = (this.showExtra)
      ? 'show'
      : 'hide';
    const tabIndex = (this.showExtra)
      ? undefined
      : -1

    return html`
      <button @click=${this._toggleModal} class="extra-open focusable" value="extra"><span class="sr-only">Show extra filters</span></button>
      <div class="wrap wrap--${show}">
        <button class="btn-close btn-close--${show} focusable"
                value="extra"
                tabindex="${ifDefined(tabIndex)}"
               @click=${this._toggleModal}>
          <span class="sr-only">Hide extra filters</span>
        </button>
        <h2>Filters for hidden columns</h2>
        <div class="extra__list__wrap">
          <ul class="extra__list">
            ${this.headConfig.filter(
              (col: IHeadConfig) => (!col.isColumn && col.isFilter)
            ).map(
              (col: IHeadConfig) : TemplateResult => html`
                <li>
                  <filter-sort-ctrl colname="${col.field}"
                                    label="${col.label}"
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
                                   .options=${col.enumList}
                                   @change=${this._handler}
                                   ?expanded=${this.showExtra}
                                    alwaysExpanded>
                    ${col.label}
                  </filter-sort-ctrl>
                </li>`

          )}
        </ul>

        </div>
      </div>
      <button class="bg-close bg-close--${show}"
              value="extra"
              tabindex="${ifDefined(tabIndex)}"
             @click=${this._toggleModal}>
        <span class="sr-only">Hide extra filters</span>
      </button>
    `;
  }

  private _renderExportColCtrl = (tabIndex: number|undefined) => (col: IHeadConfig) : TemplateResult => {
     getToggleInput(
      this.id, col.field, col.export,
      'Include ' + col.label, 'Omit ' + col.label,
      this._toggleExportCol,
      col.label,
      tabIndex
    );
    return html`
      <li class="export-ctrl">
        <span class="cb-btn__wrap">
          <input
            type="checkbox"
            class="cb-btn__input"
            id="${this.id}__${col.field}"
            data-type="${col.label}"
            tabindex="${ifDefined(tabIndex)}"
           ?checked="${col.export}"
           @change=${this._toggleExportCol}
          />
          <label
            for="${this.id}__${col.label}"
            class="cb-btn__label"
            title="${col.label}"
          >${(col.export)
              ? 'Include ' + col.label
              : 'Omit ' + col.label
          }</label>
        </span>
        <button value="up"
                data-type="${col.field}"
                class="export-up focusable"
                tabindex="${ifDefined(tabIndex)}"
               @click=${this._toggleModal}>
          Up
        </button>
        <button value="down"
                data-type="${col.field}"
                class="export-down focusable"
                tabindex="${ifDefined(tabIndex)}"
               @click=${this._toggleModal}>
          Down
        </button>
      </li>
  `;
  }

  private _renderExport = () : TemplateResult|string => {
    if (this.allowExport === false) {
      return '';
    }

    const cols = [...this.headConfig];
    cols.sort(sortExportCols);

    const show = (this.showExport)
      ? 'show'
      : 'hide';
    const tabIndex = (this.showExport)
      ? undefined
      : -1

    return html`
      <button value="export"
              class="export focusable"
             @click=${this._toggleModal}>
        Export
      </button>
      <div class="wrap wrap--${show}">
        <button class="btn-close btn-close--${show} focusable"
                value="export"
                tabindex="${tabIndex}"
               @click=${this._toggleModal}>
          <span class="sr-only">Hide export control</span>
        </button>
        <h2>Manage exported columns</h2>
        <div class="extra__list__wrap">
          <ul class="extra__list">
            <li class="sep-ctrl">
              <label for="${this.id}__colSep" class="sep-ctrl__label">Column seperator:</label>
              <input type="text"
                     id="${this.id}__colSep"
                     value="${convertSep(this.colSeperator, true)}"
                     maxlength="4"
                     data-type="column"
                     tabindex="${ifDefined(tabIndex)}"
                     size="2"
                    @change=${this._updateSep} />
            </li>
            <li class="sep-ctrl">
              <label for="${this.id}__rowSep" class="sep-ctrl__label">Row seperator:</label>
              <input type="text"
                     id="${this.id}__rowSep"
                     value="${convertSep(this.rowSeperator, true)}"
                     maxlength="4"
                     data-type="row"
                     tabindex="${ifDefined(tabIndex)}"
                     size="2"
                    @change=${this._updateSep} />
            </li>
            ${repeat(
              cols,
              (col : IHeadConfig) => col.field,
              this._renderExportColCtrl(tabIndex)
            )}
          </ul>
        </div>
        <p class="download__wrap">
          <a href="#"
             class="download focusable"
             tabindex="${ifDefined(tabIndex)}"
            @click=${this._download}>
            Download
          </a>
        </p>
      </div>
      <button class="bg-close bg-close--${show}"
              value="export"
              tabindex="${ifDefined(tabIndex)}"
             @click=${this._toggleModal}>
        <span class="sr-only">Hide export control</span>
      </button>`;
  }

  //  END:  Private render methods
  // ------------------------------------------------------

  //  END:  private methods
  // ======================================================
  // START: Public methods


  /**
   * Get the List Control object for the last column to be updated
   *
   * @returns A list control object if any columns have been update.
   *          FALSE otherwise
   */
  getLastUpdated() : IListCtrlItem|false {
    const output = this.headConfig.filter(
      (item: IHeadConfig) => item.field === this.lastFiltered
    ).map(headConfigToListCtrl);

    return (output.length === 1)
      ? output[0]
      : false;
  }

  /**
   * Get all the list Control items for this table
   *
   * @returns All List Control items
   */
  getAllListCtrl() : Array<IListCtrlItem> {
    return this.headConfig.map(headConfigToListCtrl);
  }

  render() {
    if (this.doInit === true) {
      this._doInit();
    }

    let extraClass = (this.nonCols.length > 0)
      ? ' filter-sort__wrap--extra'
      : '';
    extraClass += (this.allowExport)
    ? ' filter-sort__wrap--export'
    : '';

    // const data = filterAndSort(this.tableData, this.)

    return html`
      <div class="filter-sort__wrap${extraClass}">
        <div class="toggles">
          ${this._renderExtraFilters()}
          ${this._renderExport()}
        </div>
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
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'filter-sort-table': FilterSortTable
  }
}
