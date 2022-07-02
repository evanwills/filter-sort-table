import { css } from "lit";
import { srOnly } from "./sr-only.css";

export const style = css`
  :host {
    --table-border: none;
    --row-border: 0.05rem solid #000;
    --col-border: 0.05rem solid #000;
    --cell-v-padding: 0.5rem;
    --cell-h-padding: 0.75rem;
    --text-colour: #000;
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
    margin: calc(var(--cell-v-padding) * -1) calc(var(--cell-h-padding) * -1);
  }
  a {
    padding: var(--cell-v-padding) var(--cell-h-padding);
  }
  filter-sort-ctrl {
    padding: 0;
  }
`;
