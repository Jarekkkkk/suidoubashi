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
    border: 1px solid #606266;
    background-color: #fff;
    box-shadow: none;
    color: #2977EC;
    font-size: 24px;
    font-weight: bold;
    text-align: center;

    &:focus, &:focus-within, &:active {
      border-color: #2977EC;
      box-shadow: none;
      outline: none;
    }

    &::placeholder {
      padding-left: 10px;
      color: #A4A8B3;
      text-align: left;
      font-weight: normal;
      font-size: 24px;
    }
  }
`