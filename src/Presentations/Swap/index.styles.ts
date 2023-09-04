import { css } from '@emotion/css'

export const selectContainer = css`
  max-height: 550px;
`

export const swapContainer = css`
  display: flex;
  flex-direction: column;
  margin: 30px auto;
  max-width: 500px;
`

export const coinButton = css`
  display: flex;
  align-items: center;
  cursor: pointer;

  &:after {
    content: '';
    display: flex;
    width: 0;
    height: 0;
    margin: 5px;
    border-top: 10px solid #3F4247;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
  }
`

export const arrowDownIcon = css`
  margin: 0 auto 30px auto;
`

export const swapButton = css`
  margin: 0 auto;
  max-width: 160px;
`

export const inputContent = css`
  margin: 0 auto;
  max-width: 400px;
`

export const searchInputIcon = css`
  position: absolute;
  top: 4px;
  left: 2px;
  bottom: 0;
  z-index: 1;
`

export const coinContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 28px 0;
  max-width: 400px;
  border-bottom: 1px solid #A4A8B3;
`

export const banlaceContent = css`
  margin: 20px auto;
  max-width: 400px;

  > div {
    margin-bottom: 16px;
  }
`

export const cardLoadingContent = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  margin-bottom: 4px;
`