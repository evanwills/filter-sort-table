import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { style } from './css/style.css';
import { headConfig } from './types/header-config'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('filter-sort-table')
export class FilterSortTable extends LitElement {
  @property()
  headConfig : Array<headConfig> = [];

  @property()
  listData : Array<headConfig> = [];

  @property({ type: Boolean })
  html : boolean = false;


  static styles = style;

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `
  }

  private _onClick() {
    this.count++
  }

  foo(): string {
    return 'foo'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'filter-sort-table': FilterSortTable
  }
}
