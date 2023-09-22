import { css } from '@emotion/css'

export const InputContent = css`

  svg {
    margin-right: 3px;
  }

  input {
    margin: 0;
    padding: 0 10px;
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid var(--Grey);
    background-color: var(--White);
    box-shadow: none;
    color: var(--Brand);
    font-size: 24px;
    font-weight: bold;
    text-align: center;

    &:focus, &:focus-within, &:active {
      border-color: var(--Brand);
      box-shadow: none;
      outline: none;
    }

    &::placeholder {
      padding-left: 10px;
      color: var(--LightGrey);
      font-weight: normal;
      font-size: 16px;
      vertical-align: middle;
    }
  }
`