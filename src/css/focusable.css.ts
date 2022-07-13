import { css } from "lit";

export const focusable = css`
  .focusable:focus, input:focus + .focusable-label {
    outline: #44f solid 0.15rem;
    outline-offset: 0.1rem;
  }
`;
