import { css } from '@emotion/css'

export const controlContainer = css`
  height: 100%;
`

export const buttonSection = css`
  display: flex;
  flex-direction: row;
  justify-content: right;
  padding: 20px 18px 0;

  div:not(:nth-last-child(1)) {
    margin-right: 8px;
  }
`

export const contentSection = css`
  margin-top: 12px;
  padding: 10px 18px;
  height: calc(100% - 212px);
  overflow: scroll;
`

// _VestCard
export const vestCardLoadingContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
`
export const vestCardContainer = css`
  display: flex;
  flex-direction: row;
  padding: 12px;
  border-radius: 12px;
  background-color: #FFF;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);

  &:not(:nth-last-child(1)) {
    margin-bottom: 12px;
  }
`

export const imgSection = css`
  min-width: 240px;
  height: 240px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
`

export const cardContentSection = css`
  display: flex;
  flex-direction: column;
  padding: 14px 8px 14px 16px;
  width: 100%;

  * {
    font-size: 16px;
    font-weight: bold;
    color: #606266;
  }

  > :not(:nth-last-child(1)) {
    margin-bottom: 12px;
  }
`

export const textContent = css`
  display: flex;
  align-items: center;
  flex-direction: row;

  span {
    display: flex;
    min-width: 60px;
    padding: 6px 16px;
    justify-content: center;
    align-items: center;
    margin-left: 12px;
    border-radius: 8px;
    color: #2977EC;
    background: #E4F7FE;
  }
`

export const valueContent = css`
  display: flex;
  flex-direction: column;
`

export const mulValueContent = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &:nth-child(1) {
    margin-right: 12px;
  }

  @media screen and (max-width: 1280px) {
    flex-direction: column;

    div:nth-child(1) {
      margin-right: 0;
      margin-bottom: 12px;
    }
  }
`

export const buttonContent = css`
  display: flex;
  flex-direction: row;
  justify-content: right;
  margin-top: auto;

  div:nth-child(1) {
    margin-right: 4px;
  }
`
