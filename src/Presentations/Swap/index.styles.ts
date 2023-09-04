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

export const slognContent = css`
  margin: 30px auto;
  text-align: center;
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
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: rotate(180deg);
  }
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
  border-bottom: 1px solid #A4A8B3;
`

export const coinBlock = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 400px;
  padding: 28px 0;
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

export const coincardContent = css`
    > div {
      transition: 0.3s;
      cursor: pointer;
    }

  &:hover {
    > div {
      background-color: #E4F7FE;
    }
  }
`

export const infoContent = css`
  margin: 0 auto 28px auto;
  min-width: 350px;
`

export const bonusText = css`
  margin-bottom: 28px;
  color:  #606266;
  font-size: 12px;
  text-align: center;
  font-weight: normal;
  line-height: 1;

  span {
    margin-left: 20px;
    color: #7FDF7D;
    font-size: 16px;
  }
`

export const infoText = css`
  display: flex;
  justify-content: space-between;
  color:  #303133;
  font-size: 20px;
  font-weight: bold;
  line-height: 2;

  span {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: normal;
  }
`