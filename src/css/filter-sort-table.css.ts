import { css } from "lit";
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
  .extra-open {
    position: absolute;
    top: 0;
    right: 0;
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
  .wrap > h2 {
    box-sizing: border-box;
    margin: -1.5rem -1.5rem 0.5rem;
    padding: 0.5rem;
    position: relative;
  }
  .wrap > h2::after {
    background: linear-gradient(rgba(255, 255,255, 1), rgba(255, 255,255, 0.7), rgba(255, 255, 255, 0));
    bottom: -1rem;
    content: '';
    display: block;
    height: 1.5rem;
    left: -0.5rem;
    position: absolute;
    right: -0.5rem;
    width: 100%;
    z-index: 1000;
  }
  .wrap > ul {
    height: 100%;
    list-style: none;
    max-height: ${maxHeight}rem;
    margin: -1rem -2rem -2rem -2rem;
    overflow-y: auto;
    padding: 1rem 0 0 0;
    position: relative;
    z-index: 100;
  }
  /**
  .wrap::after {
    content: '';
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 1rem;
    background-color: #fff;
  }
  */
  .wrap li {
    padding: var(--cell-v-padding) 1rem;
    margin: 0;
    border-top: var(--row-border);
    list-style: none;
  }
  .wrap li:first-child {
    border-top: none;
  }
  .export {
    background-color: var(--export-bg-colour);
    color: var(--export-text-colour);
    border: var(--row-border);
    font-family: var(--font-family);
    font-weight: bold;
    padding: 0.375rem 1rem;
    position: absolute;
    right: -6.25rem;
    text-decoration: none;
    text-transform: uppercase;
    top: 0rem;
    transform: rotate(90deg);
    transform-origin: top left;
    width: auto;
  }
  .filter-sort__wrap--extra .export {
    top: 3rem;
  }
  ${srOnly}
  ${modal(maxHeight, 40)}
`;
