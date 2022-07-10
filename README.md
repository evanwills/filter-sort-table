# `filter-sort-table`


* [Introduction](#introduction)
* [Attributes](#attributes)
  * [headConfig](#headconfig)
  * [tableData](#tabledata)
  * [html](#html)
  * [lastFiltered](#lastfiltered)
  * [toggleCol](#togglecol)
  * [allowExport](#allowexport)
  * [fileName](#filename)
  * [colSep](#colsep)
  * [rowSep](#rowsep)
  * [omitHeaders](#omitheaders)
  * [doInit](#doinit)
  * [linkHandler](#linkhandler)
* [As a stand-alone HTML web component](#as-a-stand-alone-html-web-component)
  * [Pure HTML example](#html-example)
* [Instantiated/data injected via Javascript](#instantiateddata-injected-via-javascript)
  * [Using Lit HTML](#using-lit-html)
    * [Example](#lit-html-example)
  * [Data via javascript](#data-via-javascript)
* [Filter data types](#filter-data-types)
* [Data types](#data-types)
  * [`IListCtrlItem`](#ilistctrlitem)
  * [`UBoolState`](#uboolstate)
  * [`IListCtrlOptionItem`](#ilistctrloptionitem)
  * [`IHeadConfig`](#iheadconfig)
  * [`IObjScalarX`](#iobjscalarx)
  * [`UScalarX`](#uscalarx)


----

## Introduction

`filter-sort-table` is a web component that adds filter & sort 
functionality to a table. 

It's written in TypeScript using Lit HTML & Lit Element.

## Attributes

### `headConfig` 

* __Type:__ *{`Array<IHeadConfig>`}*
* __Default:__ *[`empty array`]*

When instantiated by Javascript, `headConfig` is used to pass column 
configuration to the component via an array of 
[IheadConfig](#iheadconfig) objects.

When `<filter-sort-table>` tirggers a `change` event, `headConfig` 
can used to provide the current state of the filter/sort controls 
to the client application (e.g. Redux).

### `tableData` 

* __Type:__ *{`Array<IObjectScalar>`}*
* __Default:__ *[`empty array`]*

When instantiated by Javascript, `tableData` is used to pass all the 
actual data rendered in the table list via an array of 
[IObjScalarX](#iobjscalarx) objects

### `html` 

* __Type:__ *{`boolean`}*
* __Default:__ *[`false`]*

When rendering all of the content of the `<filter-sort-table>` 
component in static HTML the `html` attribute tells the component 
to parse its inner HTML to extract the data that would normally 
come from [headConfig](#headconfig) & [tableData](#tabledata)

### `lastFiltered` 

* __Type:__ *{`string`}*
* __Default:__ *[`""` (empty string)]*

Provides infomation (to the client application) of what was last 
change in the filter/sort controls or export controls

### `toggleCol` 

* __Type:__ *{`boolean`}*
* __Default:__ *[`false`]*

Whether or not to allow users to toggle visibility of columns

### `allowExport` 

* __Type:__ *{`boolean`}*
* __Default:__ *[`false`]*

Whether or not to allow users to download the contents of the table 
as a delimited text file.

### `fileName` 

* __Type:__ *{`string`}*
* __Default:__ *[`"file.tsv"`]*

If users are allowed to download the filtered & sorted contents of 
the table as a file, this provides the default file name for the 
file.

### `colSep` 

* __Type:__ *{`string`}*
* __Default:__ *[`"\t"`]*

Character(s) used to separate column values in export file

### `rowSep` 

* __Type:__ *{`string`}*
* __Default:__ *[`"\n"`]*

Character(s) used to separate rows in export file

### `omitHeaders` 

* __Type:__ *{`boolean`}*
* __Default:__ *[`false`]*

Whether or not to omit the column header row from export file

### `doInit` 

* __Type:__ *{`boolean`}*
* __Default:__ *[`false`]*

If data is injected into the component after the HTML for the 
component is rendered, this tells the component to rerun all the 
initialisation code.

### `linkHandler` 

* __Type:__ *{`callback function`|`undefined`}*
* __Default:__ *[`undefined`]*

If links are rendered by the component but need to have custom 
handling by the client application, this allows the client 
application to provide a custom link handler for all links.



-----
## As a stand-alone HTML web component

Just wrap your table in `<filter-sort-table id="foo" html>` e.g.
```html
<filter-sort-table id="foo" html>
    <table>
        <thead>
            <tr>...</tr>
        </thead>
        <tbody>
            ...
        </tbody>
    </table>
</filter-sort-table>
```

* The table must be a simple two dimensional table.
* It requires the table to have both `<THEAD>` & `<TBODY>` elements.
* `<THEAD>` elements should only contain a single `<TR>` 
  > (__NOTE:__ Only the last `<TR>` in the `<THEAD>` is parsed)
* For columns to be filterable, each column header must have a `type` 
  data attrubte (e.g. `data-type`) see [data types](#filter-data-types) 
  for allowed values
* Each filterable column must have either a `data-field` or `id` 
  attribute so data can be matched up
* If defining preset filter states for a column, data attributes can 
  be applied for each [IListCtrlItem](#ilistctrlitem) property

### HTML Example

> __Note:__ the `html` boolean attribute. This is required for filter-sort-table to know it has to parse its inner HTML to get the data need for filtering & sorting

```html
<filter-sort-table id="users" html>
    <table>
        <thead>
            <tr>
                <th data-type="number" id="id">ID</th>
                <th data-type="text" id="user-name">User name</th>
                <th data-type="date" id="last-login">Last login</th>
                <th data-type="bool" id="logged-in">Is logged in</th>
                <th data-type="option" id="type" data-optionlist="1:Basic;2:Admin;3:Super">
                    User type
                </th>
                <th data-type="date" id="created">Created</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>1</th>
                <td>Ada Lovelace</td>
                <td>1852-11-27</td>
                <td>No</td>
                <td>Super</td>
                <td>1815-12-10</td>
            </tr>
            <tr>
                <th>2</th>
                <td>Carles Babbage</td>
                <td>1871-10-18</td>
                <td>No</td>
                <td>Admin</td>
                <td>1791-12-26</td>
            </tr>
            <tr>
                <th>3</th>
                <td>Alan Turing</td>
                <td>1954-06-07</td>
                <td>No</td>
                <td>Admin</td>
                <td>1912-06-23</td>
            </tr>
            <tr>
                <th>4</th>
                <td>Evan Wills</td>
                <td>2022-07-09</td>
                <td>Yes</td>
                <td>Basic</td>
                <td>2021-09-12</td>
            </tr>
        </tbody>
    </table>
</filter-sort-table>
```

-----
## Instantiated/data injected via Javascript


### Using Lit HTML

If instantiated via [lit html](https://lit.dev/), only two properties need to be set:
* [`headConfig`](#iheadconfig) - A list of columns & filter controls for every field you want to be filterable and column you wish to be visible to the user.
* [`tableData`](#iobjscalarx) - A list of Data for each row in the table

#### Lit HTML Example

```html
<filter-sort-table id="foo" .headconfig=${columnData} .tabledata=${tableData}></filter-sort-table>
```

### Data via javascript

If `<filter-sort-table id="foo">` is already in the HTML and you just need to inject data, as well as setting both [`headConfig`](#iheadconfig) & [`tableData`](#iobjscalarx), you also need to set `doInit` to true to force `FilterSortTable` to do all the initialisation. This is because, by the time the HTML is rendered, all the initialisation should have already been done &`doInit` has been set to `FALSE`.

-----

## Filter data types

* `text` - field data is simple text
* `number` - field data is numeric 
  (can be filtered on either single value or between min & max)
* `date` - field data is a date only value 
  (can be filtered on either single value or between min & max)
* `datetime` - field data is a date/time only value 
  (can be filtered on either single value or between min & max)
* `bool` - TRUE/FALSE, YES/NO type field
* `option` - field data can only be one of a limited number of options
* `count` - Works like `number` type
  (only used when field data contains a child array and you want to filter on the number of items in the array)

(Also called `UDataType`)

-----

## Data types

### `IListCtrlItem` 

List Control Items are used to control filtering & sorting for 
individual columns or hidden fields in the table.

```typescript
interface  IListCtrlItem {
  /**
   * Whether or not this control item is currently active
   */
  skip: boolean,
  /**
   * Property name of the field being filtered/sorted
   */
  field: string,
  /**
   * Type of data the control applies to
   *
   * * text
   * * number
   * * date
   * * datetime
   * * bool
   * * option
   * * count
   */
  type: UDataType,
  /**
   * Normally, empty values are ignored. This causes only items with
   * empty values to be included in the list
   */
  filterOnEmpty: boolean,
  /**
   * Value on which to filter
   */
  filter: string|number,
  /**
   * For date & number fields this sets the lower limit of values
   */
  min: number,
  /**
   * For date & number fields this sets the upper limit of values
   */
  max: number,
  /**
   * Control how to filter boolean values
   */
  bool: UBoolState,
  /**
   * For fields that represent a fixed set of options, this allows
   * users to filter on multiple options
   */
  options: IListCtrlOptionItem[],
  /**
   * Field sort state
   *  * 1  - Descending
   *  * 0  - ignore
   *  * -1 - ascending
   */
  order: UBoolState,
  /**
   * for fixed option fields, whether or not to order option label
   * or value
   */
  orderByValue: boolean,
  /**
   * The order in which sorting occurs
   * The lower the priority the earlier it gets sorted
   *
   * -1 = no sorting
   */
  orderPriority: number
}
```

### `UBoolState`

`UBoolState` is used for filtering boolean values (and sorting direction)

* `0` - *Ignore*
* `1` - *TRUE* (or *Decending*, when used for sorting)
* `-1` - *FALSE* (or *Ascending*, when used for sorting)

### `IListCtrlOptionItem`

Option filters allow you to include multiple values in the filtered list (i.e. options can be combined in an `OR` filter)

```typescript
interface IListCtrlOptionItem {
  /**
   * ID of the option being filtered on
   */
  id: number,
  /**
   * Whether the option should be 
   * * ignored or 
   * * Included if selected or 
   * * Excluded if selected
   */
  mode: UBoolState
}
```


### `IHeadConfig` 

`IHeadConfig` represents configuration for one field (column) in an object that is to be rendered in a table row.

> __NOTE:__ Because tables can hold more columns than can be rendered
>           conveniently. It's possible to hide columns but still 
>           filter & sort on those columns.

```typescript
interface IHeadConfig extends IListCtrlItem {
  /**
   * Column header text
   */
  label: string,
  /**
   * Whether or not this field should be included as a column in the
   * table
   */
  isColumn: boolean,
  /**
   * Whether or not this field should be included as a column in the
   * table
   */
  isFilter: boolean,
  /**
   * If this is not empty, the value of the cell will be linked to
   * the URL held in the field this references
   */
  urlField ? : string,
  /**
   * List of option IDs and labels
   */
  enumList ? : Array<IDbEnum>,
  /**
   * Whether or not this control item is currently active
   */
  skip: boolean,
  /**
   * Property name of the field being filtered/sorted
   */
  field: string,
  /**
   * Type of data the control applies to
   *
   * * text
   * * number
   * * date
   * * datetime
   * * bool
   * * option
   * * count
   */
  type: UDataType,
  /**
   * Normally, empty values are ignored. This causes only items with
   * empty values to be included in the list
   */
  filterOnEmpty: boolean,
  /**
   * Value on which to filter
   */
  filter: string|number,
  /**
   * For date & number fields this sets the lower limit of values
   */
  min: number,
  /**
   * For date & number fields this sets the upper limit of values
   */
  max: number,
  /**
   * Control how to filter boolean values
   */
  bool: UBoolState,
  /**
   * For fields that represent a fixed set of options, this allows
   * users to filter on multiple options
   */
  options: IListCtrlOptionItem[],
  /**
   * Field sort state
   *  * 1  - Descending
   *  * 0  - ignore
   *  * -1 - ascending
   */
  order: UBoolState,
  /**
   * for fixed option fields, whether or not to order option label
   * or value
   */
  orderByValue: boolean,
  /**
   * The order in which sorting occurs
   * The lower the priority the earlier it gets sorted
   *
   * -1 = no sorting
   */
  orderPriority: number
}
```


### `IObjScalarX`

Client specified list of properties & values for each row in the table

```typescript
interface IObjScalarX {
    /**
     * Column/Filter name & data
     */
  [index: string]: UScalarX
}
```

### `UScalarX`

```typescript
type UScalarX = string | number | boolean | IObjScalarX | Array<string> | Array<any>;
`
