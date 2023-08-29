import { css } from '@emotion/css'

export const button = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding:13px 6px;
  min-width: 160px;
  height: 40px;
  border-radius: 4px;
  border-style: none;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    outline-offset: 0px;
  }

  p {
    margin: 0;
    font-size: 13px;
    font-weight: bold;
    line-height: 1;
  }

  svg {
    margin-right: 4px;
    width: 24px;
    height: 24px;
  }
`

export const filled = css`
  background-color: #2977EC;

  p {
    color: #FFF;
  }

  &:hover {
    background-color: #1356BA;
  }

  &:disabled {
    cursor: no-drop;
    background-color: #A4A8B2;
  }
`

export const outlined = css`
  border: 1px solid #2977EC;
  background-color: #FFF;

  p {
    color: #2977EC;
  }

  &:hover {
    background-color: #F4FCFF;
  }

  &:disabled {
    cursor: no-drop;
    border: 1px solid #A4A8B2;
    background-color: #FFF;

    p {
      color: #A4A8B2;
    }
  }
`

export const tonal = css`
  border: 1px solid #2977EC;
  background-color: #E4F7FE;

  p {
    color: #2977EC;
  }

  &:hover {
    background-color: #C1EEFF;
  }

  &:disabled {
    cursor: no-drop;
    border: 1px solid #A4A8B2;
    background-color: #EBEBEB;

    p {
      color: #A4A8B2;
    }
  }
`

export const badge = css`
  padding: 2px 13px;
  min-width: auto;
  height: 20px;
  border-radius: 20px;
  background-color: #FFD24D;

  p {
    color: #FFF;
  }

  &:hover {
    background-color: #FFD24D;
  }

  &:disabled {
    cursor: no-drop;
    background-color: #ffd24d4d;
  }
`

export const types: Record<string, string> = {
  "filled": filled,
  "outlined": outlined,
  "tonal": tonal,
  "badge": badge,
}