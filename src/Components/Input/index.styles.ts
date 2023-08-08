import { css } from '@emotion/css'

export const InputContent = css`
  display: flex;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid #606266;
  background-color: #fff;
  overflow: hidden;
  transition: 0.3s;

  &:focus, &:focus-within, &:active {
    border-color: #2977EC;
  }

  svg {
    margin-right: 3px;
  }

  input {
    margin: 0;
    padding: 0;
    border: none;
    color: #606266;
    font-size: 16px;
    width: 100%;

    &:focus {
      border: none;
      outline: none;
    }

    &::placeholder {
      color: #606266;
    }
  }
`