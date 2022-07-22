import { css } from "lit";

export const modal = (maxHeight: number = 35, maxWidth: number = 35) => css`
  .wrap {
    background-color: var(--modal-bg-colour);
    box-sizing: border-box;
    color: var(--modal-txt-colour);
    /* height: calc(100% - 2rem); */
    left: 50%;
    max-height: var(--max-modal-height, ${maxHeight}rem);
    max-width: ${maxWidth}rem;
    opacity: 0;
    padding: 2rem;
    position: fixed;
    text-align: left;
    top: 50%;
    transform: scale(0) translate(-50%, -50%);
    transition: opacity ease-in-out var(--trans-speed) 0.15s,
                height ease-in-out var(--trans-speed) 0.15s,
                transform ease-in-out var(--trans-speed) 0.15s;
    transform-origin: 0 0;
    z-index: 100;
    width: calc(100% - 2rem);
  }
  .wrap--show {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%);
  }
  .wrap__inner {
    max-height: calc(var(--max-modal-height) - 4rem);
    overflow-y: auto;
  }
  .bg-close {
    background-color: var(--modal-overlay-colour);
    border-radius; 30rem;
    border: none;
    bottom: 0;
    height: 100%;
    left: 0;
    right: 0;
    opacity: 0;
    position: fixed;
    top: 0;
    transform: scale(0);
    transition: opacity ease-in-out var(--trans-speed),
                transform ease-in-out var(--trans-speed);
    width: 100%;
    z-index: 99
  }
  .bg-close--show {
    opacity: 1;
    transform: scale(1);
    z-index: 99
  }
  .btn-close {
    background-color: var(--close-btn-bg-colour);
    border-radius: 1rem;
    border: none;
    border: 0.1rem solid var(--close-btn-text-colour);
    color: var(--close-btn-text-colour);
    display: inline-block;
    font-weight: bold;
    height: 1.5rem;
    line-height: 0.25rem;
    position: absolute;
    right: -0.5rem;
    top: -0.5rem;
    width: 1.5rem;
  }
  .btn-close::before {
    bottom: 0.05rem;
    content: '\u2717';
    position: relative;
  }
`;
