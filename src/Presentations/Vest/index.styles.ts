import { css } from '@emotion/css'

export const controlContainer = css`
  height: 100%;
`

export const buttonSection = css`
  display: flex;
  gap: 10px;
  flex-direction: row;
  justify-content: right;
  padding: 20px 18px 0;

  div:not(:nth-last-child(1)) {
    margin-right: 8px;
  }

  @media screen and (max-width: 1080px) {
    flex-direction: column;
    flex-wrap: wrap;
  }
`

export const contentSection = css`
  margin-top: 12px;
  padding: 10px 18px;
  height: calc(100% - 212px);
  overflow: scroll;

  @media screen and (max-width: 1080px) {
    height: calc(100% - 325px);
  }
`

export const EmptyContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`

// _VestCard
export const vestCardLoadingContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border-radius: 12px;
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);
  box-sizing: border-box;
`
export const vestCardContainer = css`
  display: flex;
  flex-direction: row;
  padding: 12px;
  border-radius: 12px;
  background-color: var(--White);
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);

  &:not(:nth-last-child(1)) {
    margin-bottom: 12px;
  }

  @media screen and (max-width: 1080px) {
    flex-wrap: wrap;
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

  @media screen and (max-width: 1080px) {
    margin: 0 auto;
  }
`

export const cardContentSection = css`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 14px 8px 14px 16px;
  width: calc(100% - 240px);

  * {
    font-size: 16px;
    font-weight: bold;
    color: var(--Grey);
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
    color: var(--Brand);
    background: var(--BrandLight);
  }
`

export const valueContent = css`
  display: flex;
  flex-direction: column;
`

export const valueTitle = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;

  span {
    font-size: 12px;
  }
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
  border: 1px solid var(--LightGrey);
  border-radius: 8px;
  background-color: var(--White);
  color: var(--LightGrey);
  font-size: 13px;
  font-weight: normal;
  line-height: 1;
`

export const vsdbCountBlock = css`
  display: flex;
  flex-direction: column;
  color: var(--LightGrey);

  div {
    color: var(--LightGrey);
  }

  div:not(:nth-last-child(1)) {
    margin-bottom: 8px;
  }

  span {
    color: var(--Yellow);
    font-weight: bold;
  }
`

export const vsdbCountContent = css`
  margin-top: 4px;
  font-size: 32px;
  font-weight: bold;
  color: var(--Brand) !important;
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
  border-top: 1px solid var(--LightGrey);
`

export const errorContent = css`
  margin: 28px 0;
`

export const vsdbDepositCount = css`
  padding: 22px 35px;
  border: 1px solid var(--LightGrey);
  border-radius: 8px;
`

// MergeVSDBModal
export const perviewContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
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
    color: var(--LightGrey);
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
  border: 1px solid var(--Brand);
  border-radius: 8px;
  overflow: hidden;
`

export const badgeContent = css`
  display: flex;
  align-items: center;
  flex-direction: row;

  button:nth-child(2) {
    margin-left: 12px;
  }

  button:nth-child(3) {
    margin-left: 8px;
  }
`

export const newStyleVSDBText = css`
  margin: 0 auto 20px;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  color: var(--Brand);
`

export const addressContent = css`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;

  div {
    color: var(--Brand)  !important;
    font-size: 10px !important;
  }
`

export const prev = css`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const next = css`
  display: block;
  white-space: nowrap;
`

export const buttonLevelup = css`
  margin-left: 5px;
  margin-right: 5px;
  margin-bottom: 5px;
`