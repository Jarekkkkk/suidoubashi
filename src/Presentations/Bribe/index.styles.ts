import { css } from '@emotion/css'

export const bribeWrapper = css`
  padding: 20px;
  overflow: scroll;
  height: calc(100% - 150px);
`

export const bribrContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 580px;
`

export const arrowButton = css`
  display: flex;
  align-items: center;
  cursor: pointer;

  &:after {
    content: '';
    display: flex;
    width: 0;
    height: 0;
    margin: 5px;
    border-top: 10px solid var(--DarkGrey);
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
  }
`

export const inputContent = css`
  margin-top: 30px;
`

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
    border-top: 10px solid var(--DarkGrey);
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

export const searchInputIcon = css`
  position: absolute;
  top: 4px;
  left: 2px;
  bottom: 0;
  z-index: 1;
`

export const coinContent = css`
  border-bottom: 1px solid var(--LightGrey);
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
      background-color: var(--BrandLight);
    }
  }
`

export const infoContent = css`
  margin: 0 auto 28px auto;
  min-width: 350px;

  div:nth-child(1) {
    margin-bottom: 28px;
  }

  div:nth-child(2) {
    margin-bottom: 14px;
  }
`

export const errorContent = css`
  margin-bottom: 28px;
`

export const bonusText = css`
  color:  var(--Grey);
  font-size: 12px;
  text-align: center;
  font-weight: normal;
  line-height: 1;

  span {
    margin-left: 20px;
    color: var(--AppleGreen);
    font-size: 16px;
  }
`

export const infoText = css`
  display: flex;
  justify-content: space-between;
  color:  var(--Black);
  font-size: 20px;
  font-weight: bold;
  line-height: 1;

  span {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: normal;
  }
`

export const switchPriceSortButton = css`
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    opacity: 0.7;
  }
`

export const inputAnimation = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 10px;
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--Grey);
  background: var(--White);
`