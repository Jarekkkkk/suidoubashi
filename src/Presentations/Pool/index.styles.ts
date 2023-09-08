import { css } from '@emotion/css'

export const poolpContainer = css`
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  padding: 0 30px;
`

export const slognContent = css`
  margin: 30px auto;
  text-align: center;
`

export const searchInputIcon = css`
  position: absolute;
  top: 4px;
  left: 2px;
  bottom: 0;
  z-index: 1;
`

export const coinCombin = css`
  position: relative;
  width: 54px;
  text-align: left;

  svg {
    width: 32px;
    height: 32px;
  }

  svg:nth-child(1) {
    position: relative;
    z-index: 1;
  }

  svg:nth-last-child(1) {
    position: absolute;
    left: 20px;
    z-index: 0;
  }
`

export const rowContent = css`
  display: flex;
  flex-direction: row;
`

export const columnContent = css`
  display: flex;
  flex-direction: column;
`

export const boldText = css`
  color: #303133;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
`

export const greyText = css`
  color: #606266;
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
`

export const poolContent = css`
  min-width: 150px;
`

export const coinContent = css`
  display: flex;
  align-items: end;

  span {
    min-width: 3em;
    text-align: right;
  }
`