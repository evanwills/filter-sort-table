import { css } from 'lit';


export const radioSort = css`
  .radio-sort__wrap {
    display: flex;
    flex-direction: column;
    margin: 0;
    overflow: hidden;
    padding: 0.2rem;
  }
  .radio-sort__item {
    position: relative;
  }
  .radio-sort__input {
    position: absolute;
    left: -10rem;
    top: -10rem;
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  .radio-sort__label {
    background: transparent;
    border: none;
    border-radius: 1rem;
    display: block;
    height: 1.5rem;
    width: 1.5rem;
  }
  .radio-sort__label::before {
    border: 0.1rem solid var(--text-colour);
    color: var(--text-colour);
    background-color: var(--bg-colour);
    border-radius: 1rem;
    display: block;
    font-size: 2rem;
    height: 1rem;
    line-height: 1rem;
    padding: 0.1rem;
    text-indent: -0.4rem;
    width: 1rem;
  }
  input:checked + .radio-sort__label::before {
    border: 0.05rem solid var(--text-colour);
    background-color: var(--bg-colour);
    color: var(--text-colour);
  }
  .radio-sort__label--up::before {
    content: '\u25B4';
    line-height: 0.8rem;
  }
  .radio-sort__label--down::before {
    content: '\u25BE';
    line-height: 1rem;
  }
  .radio-sort__label--ignore::before {
    content: '\u2717';
    font-size: 1rem;
    text-indent: 0.05rem;
  }
`
