import { css, CSSResult } from 'lit';

import { srOnly } from './sr-only.css';
import { radioList } from './radio-list.css';
import { cbBtn } from './cb-btn.css';
import { modal } from './modal.css';
import { radioSort } from './radio-sort.css';
import { focusable } from './focusable.css';
import { moveBtn } from './move-btn.css';

export const style : CSSResult = css`
    :host {
      --bg-colour: #1b1b1b;
      --btn-padding-top: 1.3rem;
      --over-colour: rgba(0, 0, 0, 0.85);
      --over-colour--rev: rgba(255, 255, 255, 0.85);
      --txt-colour: #000;
      --trans-speed: 0.3s;
      --line-weight: 0.05rem;
      --line-weight-hvy: 0.1rem;
      --timing: 0.4s;
      --ease: ease-in-out;
      --border-radius: 1rem;
      --true-icon: "+";
      --false-icon: "\u2013";
      --modal-txt-colour: #fff;
      --modal-bg-colour: #1b1b1b;
      --modal-overlay-colour: rgba(0, 0, 0, 0.7);
    }
    ${srOnly}
    ${modal(40, 40)}
    button:hover {
      cursor: pointer;
    }
    h3 {
      margin: 0 0 0.5rem;
    }
    .btn-open {
      background-color: transparent;
      border: none;
      color: var(--txt-colour);
      display: block;
      font-size: 1rem;
      font-weight: bold;
      padding: 0.75rem 2.5rem 0.75rem 2rem;
      position: relative;
      width: 100%;
    }
    ::slotted(*) {
      color: var(--txt-colour);
      font-weight: bold;
    }
    .btn-open::before {
      content: '\u22EE';
      display: inline-block;
      font-size: 1.3rem;
      padding: 0.4rem 1rem;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-52%);
    }
    .fields {
      align-self: center;
      display: grid;
      grid-template-areas: 'fields sortCtl';
      grid-template-columns: 1fr 2.5rem;
      width: 100%;
    }
    .fields--help {
      grid-template-areas: 'fields  sortCtl'
                           ' help      .';
    }
    .field--always-expanded.field--can-move {
      position: relative;
      padding-bottom: 1rem;
    }
    .fields .fields-list {
      grid-area: fields;
      list-style-type: none;
      padding: 0;
      margin: 0.5rem 0;
    }
    .fields li {
      margin-top: 0.5rem;
    }
    .radio-sort__wrap {
      align-self: center;
      grid-area: sortCtl;
      justify-self: end;
      --txt-colour: var(--txt-colour);
    }
    .filter-label {
      display: inline-block;
      width: 5rem;
    }
    input.filter-input[type=text] {
      display: inline-block;
      width: calc(100% - 6rem);
    }
    .help-block {
      font-weight: normal;
      grid-area: help;
    }
    code {
      background-color: var(--txt-colour);
      border: 0.05rem solid var(--bg-colour);
      padding: 0.2rem 0.3rem;
    }
    .th {
      width: 100%;
    }

    .cb-btn__label, .radio-list__wrap, .radio-list__label {
      --bg-colour: var(--bg-colour);
      --txt-colour: var(--txt-colour);
    }
    .option-list {
      margin: 0;
      padding: 0;
    }
    .option-list__item {
      list-style-type: none;
      display: flex;
      align-items: center;
    }
    .option-list__label {
      flex-grow: 1;
    }

    ${radioList()}
    ${cbBtn}
    ${moveBtn}
    ${radioSort}
    ${focusable}
    .move-btn__wrap--horizontal {
      --bg-colour: var(--txt-colour);
      --txt-colour: var(--bg-colour);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  `;
