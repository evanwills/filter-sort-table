import { css } from "lit";

export const moveBtn = css`

  .move-btn__wrap {
    display: flex;
    flex-direction: column;
    width: 1.5rem;
  }
  .move-btn {
    background: transparent;
    border: none;
    border-radius: 1rem;
    display: block;
    height: 1.5rem;
    width: 1.5rem;
  }
  .move-btn::before {
    border: 0.1rem solid var(--txt-colour);
    color: var(--txt-colour);
    background-color: var(--bg-colour);
    border-radius: 1rem;
    display: block;
    font-size: 2rem;
    height: 1rem;
    line-height: 1rem;
    padding: 0.1rem;
    text-indent: -0.35rem;
    width: 1rem;
  }
  .move-btn--up::before {
    content: '\u25B4';
    line-height: 0.7rem;
  }
  .move-btn--down::before {
    content: '\u25BE';
    line-height: 1rem;
  }
  .move-btn--left::before {
    content: '\u25C2';
    line-height: 0.7rem;
  }
  .move-btn--right::before {
    content: '\u25B8';
    line-height: 1rem;
  }
`;
