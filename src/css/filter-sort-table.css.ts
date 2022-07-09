import { css } from "lit";
import { cbBtn } from "./cb-btn.css";
import { modal } from "./modal.css";
import { srOnly } from "./sr-only.css";
// import { srOnly } from "./sr-only.css";

const maxHeight = 55;

export const style = css`
  :host {
    --table-border: none;
    --row-border: 0.05rem solid #000;
    --col-border: 0.05rem solid #000;
    --cell-v-padding: 0.5rem;
    --cell-h-padding: 0.75rem;
    --text-colour: #000;
    --close-btn-bg-colour: #000;
    --close-btn-text-colour: #fff;
    --font-family: Arial, Helvetica, sans-serif;
    --export-bg-colour: #040;
    --export-text-colour: #fff;
    --true-icon: "\u2713";
    --false-icon: "\u2717";
  }

  table {
    border: var(--table-border);
    border-collapse: collapse;
  }
  th {
    border-left: var(--col-border);
    position: relative;
  }
  th:first-child {
    border-left: none;
  }
  th, td {
    color: var(--text-colour);
    padding: var(--cell-v-padding) var(--cell-h-padding);
  }
  thead {
    vertical-align: bottom;
  }
  tbody th, tbody td {
    border-left: var(--col-border);
    border-top: var(--row-border);
    vertical-align: top;
  }
  a, filter-sort-ctrl {
    display: inline-block;
    margin: 0;
    padding: 0;
    width: 100%;
  }
  a {
    padding: var(--cell-v-padding) var(--cell-h-padding);
  }
  .filtered-col {
    padding: 0;
  }
  .has-link {
    padding: 0;
  }
  .filter-sort__wrap--extra, .filter-sort__wrap--export {
    padding-right: 2.5rem;
    position: relative;
  }
  .wrap > h2 {
    box-sizing: border-box;
    margin: -1.5rem -1.5rem 1rem;
    padding: 0.5rem;
    position: relative;
  }
  .extra__list {
    height: 100%;
    list-style: none;
    max-height: calc(${maxHeight}rem - 5rem);
    margin: -0.75rem -2rem -2rem -2rem;
    overflow-y: auto;
    padding: 1rem 0 0 0;
    position: relative;
    z-index: 100;
  }
  .wrap li {
    padding: var(--cell-v-padding) 1rem;
    margin: 0;
    border-top: var(--row-border);
    list-style: none;
  }
  .wrap li:first-child {
    border-top: none;
  }
  .toggles {
    position: sticky;
    top: 0;
    float: right;
  }
  .extra__list__wrap {
    position: relative;
  }
  .extra__list__wrap::after {
    background: linear-gradient(rgba(255, 255,255, 1), rgba(255, 255,255, 0.7), rgba(255, 255, 255, 0));
    top: 0;
    content: '';
    display: block;
    height: 1.5rem;
    left: -2rem;
    position: absolute;
    right: -2rem;
    width: calc(100% + 3rem);
    z-index: 1000;
  }
  .extra-open {
    cursor: pointer;
    display: block;
    width: 2rem;
    height: 2rem;
    border: var(--col-border);
    background-color: transparent;
    font-size: 1.3rem;
    font-weight: bold;
    /* padding: var(--cell-v-padding) var(--cell-h-padding); */
  }
  .extra-open::after {
    content: '\u22EE';
  }
  .export, .download {
    background-color: var(--export-bg-colour);
    color: var(--export-text-colour);
    padding: 0.45rem 1rem;
    width: auto;
  }
  .export {
    cursor: pointer;
    border: var(--row-border);
    font-family: var(--font-family);
    font-weight: bold;
    text-decoration: none;
    text-transform: uppercase;
    transform: rotate(90deg);
    transform-origin: left bottom;
    width: auto;
    margin-top: -1rem;
  }
  .download__wrap {
    left: 0;
    margin: 0.75rem 0.5rem 0px;
    padding: 0px;
    position: absolute;
    right: 4rem;
    text-align: right;
    top: 0rem;
    width: calc(100% - 2rem);
  }
  .download {
    text-decoration: none;
  }
  .download:hover {
    text-decoration: underline;
  }

  .focusable:focus {
    outline: #44f solid 0.15rem;
    outline-offset: 0.1rem;
  }

  .export-ctrl {
    display: grid;
    grid-template-areas: "toggle up"
                         "toggle down";
    grid-template-columns: 1fr 3rem;
    grid-template-rows: auto auto;
  }
  .cb-btn__wrap {
    grid-area: toggle;
    align-self: center;
  }
  .export-up {
    grid-area: up;
  }
  .export-down {
    grid-area: down;
  }
  .sep-ctrl {
    display: flex;
    column-gap: 0.5rem;
  }
  .sep-ctrl__label {
    width: 9.5rem;
    font-weight: bold;

  }


  ${srOnly}
  ${modal(maxHeight, 40)}
  ${cbBtn}
`;
