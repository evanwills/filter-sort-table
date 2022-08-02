import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('short-date')
export class ShortDate extends LitElement {

  /**
   * Unix Timestamp (number of seconds) for the date & time this
   * component is to display.
   */
  @property({ type: Number })
  timestamp : number = 0;

  /**
   * Previous timestamp used for when the rendered date/time should
   * be compared to a previous date/time. (If they are the same the
   * value in the `same` attribute will be rendered)
   */
  @property({ type: Number })
  previous : number = 0;

  /**
   * Whether or not to display the date/time as relative to the
   * current time
   */
  @property({ type: Boolean })
  relative : boolean = false;

  /**
   * Maximum number of seconds between now and timestamp before
   * using short date
   */
  @property({ type: Number })
  maxRel : number = 0;

  @property({ type: Boolean })
  hideSlotIfSame : boolean = false;

  @property({ type: Boolean })
  showSlot : boolean = false;

  /**
   * Placeholder text for search input
   */
  @property({ type: String })
  same : string = 'Never';

  @state()
  interval : number = 0;

  static styles = css`
    :host {
      --pad-right: 0.75rem;
      --pad-left: 0.75rem;
    }
    .wrap {
      display: inline-flex;
    }
    .date {
      padding-right: var(--pad-right);
    }
    ::slotted(.done-by) {
      padding-left: var(--pad-left);
    }
  `;

  private _timer : number = -1;
  private _fullDate : string = '';
  private _shortDate : string = '';
  // private _short : DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  // private _short  = { day: 'numeric', month: 'short', year: 'numeric' };
  // private _long : DateTimeFormatOptions = {
  // private _long = {
  //   hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric',
  //   weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
  // };

  private _setInterval(start: number) : number {
    const now = Math.round(Date.now() / 1000);
    return now - start;
  }

  /**
   * Set up a series of timers to
   * @param data
   * @returns
   */
  private _updateInterval(data : ShortDate) {
    return function () {
      const interval = data._setInterval(data.timestamp);

      data.interval = interval;

      const intervals = [
        1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800,
        3600, 7200, 10800, 14400, 18000, 21600, 25200
      ];

      for (let a = 0; a < intervals.length; a += 1) {
        if (interval < intervals[a]) {
          data._timer = window.setTimeout(data._updateInterval(data), intervals[a] * 1000);
        }
      }
    }
  }

  /**
   * Get the final human readable item interval string
   *
   * @param seconds Number of seconds for the provided unit
   * @param unit    Unit name
   *
   * @returns
   */
  private _intervalTxtInner(seconds : number, unit : string) : string {
    const tmp =  Math.round(this.interval / seconds);
    const s = (tmp !== 1) ? 's' : '';

    return tmp + ' ' + unit + s;
  }

  /**
   * Get human readable time interval string
   *
   * @returns
   */
  private _getIntervalTxt() : string {
    if (this.interval < 1) {
      return 'less than a second';
    } else if (this.interval === 1) {
      return 'One second';
    } else if (this.interval < 60) {
      return this.interval + ' seconds';
    } else if (this.interval < 3600) {
      return this._intervalTxtInner(60, 'minute');
    } else if (this.interval < 86400) {
      return this._intervalTxtInner(3600, 'hour');
    } else if (this.interval < 604800) {
      return this._intervalTxtInner(86400, 'day');
    } else if (this.interval < 2628002) {
      return this._intervalTxtInner(604800, 'week');
    } else if (this.interval < 2419200) {
      return this._intervalTxtInner(2628002, 'month');
    } else {
      return this._intervalTxtInner(31536000, 'year');
    }
  }

  /**
   * Render everything for this element
   *
   * @returns
   */
  render () : TemplateResult|string {
    if (this._fullDate === '') {
      const tmp = new Date(this.timestamp * 1000);
      this._shortDate = tmp.toLocaleDateString('en-au', { day: 'numeric', month: 'short', year: 'numeric' });
      this._fullDate = tmp.toLocaleString('en-au', {
        hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric',
        weekday: 'short', day: 'numeric', month: 'long', year: 'numeric'
      });
    }
    if (this.relative === true && this._timer === -1) {
      this.interval = this._setInterval(this.timestamp);
      this.relative = (this.maxRel === 0 || this.maxRel > this.interval);
      this._updateInterval(this);
    }
    if (this.previous > 0 && this.timestamp === this.previous) {
      if (this.hideSlotIfSame || !this.showSlot) {
        return this.same
      } else {
        return html`<span class="wrap">${this.same} <slot></slot></span>`
      }
    }
    const txt = (this.relative === true)
      ? this._getIntervalTxt() + ' ago'
      : this._shortDate;

    const output = html`<span title="${this._fullDate}" class="date">${txt}</span>`;

    return (this.showSlot)
      ? html`<span class="wrap">${output} <slot></slot></span>`
      : output
  }
}



declare global {
  interface HTMLElementTagNameMap {
    'short-date': ShortDate
  }
}
