import { LitElement, TemplateResult } from 'lit';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export declare class ShortDate extends LitElement {
    /**
     * Unix Timestamp (number of seconds) for the date & time this
     * component is to display.
     */
    timestamp: number;
    /**
     * Previous timestamp used for when the rendered date/time should
     * be compared to a previous date/time. (If they are the same the
     * value in the `same` attribute will be rendered)
     */
    previous: number;
    /**
     * Whether or not to display the date/time as relative to the
     * current time
     */
    relative: boolean;
    /**
     * Maximum number of seconds between now and timestamp before
     * using short date
     */
    maxRel: number;
    hideSlotIfSame: boolean;
    showSlot: boolean;
    /**
     * Placeholder text for search input
     */
    same: string;
    interval: number;
    static styles: import("lit").CSSResult;
    private _timer;
    private _fullDate;
    private _shortDate;
    private _setInterval;
    private _updateInterval;
    private _intervalTxtInner;
    private _getIntervalTxt;
    /**
     * Render everything for this element
     *
     * @returns
     */
    render(): TemplateResult | string;
}
declare global {
    interface HTMLElementTagNameMap {
        'short-date': ShortDate;
    }
}
