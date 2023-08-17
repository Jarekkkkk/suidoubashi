import { css } from '@emotion/css'

export const inputSection = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  width: 100%;
`

export const titleBlock = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  color: #3F4247;
  font-size: 24px;
  font-weight: bold;
  line-height: 1;

  span {
    margin-left: 8px;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

export const title = css`
  display: flex;
  align-items: center;
`

export const balance = css`
  display: flex;
  align-items: end;
  font-size: 13px;
  font-weight: normal;

  span {
    font-size: 20px;
    font-weight: bold;
  }
`