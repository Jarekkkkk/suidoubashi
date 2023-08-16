import { css } from '@emotion/css'

export const InputContent = css`

  svg {
    margin-right: 3px;
  }

  input {
    margin: 0;
    padding: 0 10px;
    width: 100%;
    border-radius: 8px;
    border: 1px solid #606266;
    background-color: #fff;
    box-shadow: none;
    color: #2977EC;
    font-size: 16px;
    font-weight: bold;

    &:focus, &:focus-within, &:active {
      border-color: #2977EC;
      box-shadow: none;
      outline: none;
    }

    &::placeholder {
      color: #606266;
    }
  }
`