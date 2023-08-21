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
  border-radius: 12px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);

  &:not(:nth-last-child(1)) {
    margin-bottom: 12px;
  }
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

export const marginTop = css`
  margin-top: 12px;
`

export const mulValueContent = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

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
// CreateVSDBModal
export const vsdbCountContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 14px 45px;
  border: 1px solid #A4A8B3;
  border-radius: 8px;
  background-color: #FFF;
  color: #A4A8B3;
  font-size: 13px;
  font-weight: normal;
  line-height: 1;
`

export const vsdbCountBlock = css`
  display: flex;
  flex-direction: column;
  color: #909399;

  div {
    color: #909399;
  }

  div:not(:nth-last-child(1)) {
    margin-bottom: 8px;
  }

  span {
    color: #FFD24D;
    font-weight: bold;
  }
`

export const vsdbCountContent = css`
  margin-top: 4px;
  font-size: 32px;
  font-weight: bold;
  color: #2977EC !important;
  line-height: 1;
`

export const vsdbModalbutton = css`
  display: flex;
  justify-content: center;
  margin-top: 28px;
`

export const vsdbTabContainer = css`
  display: block;
  margin-top: 30px;
  min-height: 360px;
`
// DepositVSDBModal
export const vsdbDepositCountBlock = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid #A4A8B3;
`
export const vsdbDepositCount = css`
  padding: 22px 35px;
  border: 1px solid #A4A8B3;
  border-radius: 8px;
`

// MergeVSDBModal
export const perviewContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 30px;
  width: 100%;
`

export const perviewCardBlock = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
  width: calc(50% - 28px);
`

export const perviewCard = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  max-width: 140px;

  div {
    color: #A4A8B3;
    font-size: 13px;
    font-weight: normal;
    line-height: 1.5;
  }

  img {
    width: 100%;
    height: auto;
  }
`

export const perviewImage = css`
  margin-top: 12px;
  border: 1px solid #2977EC;
  border-radius: 8px;
  overflow: hidden;
`