import { css } from '@emotion/css'

export const voteWrapper = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  height: calc(100% - 150px);
`

export const searchInputIcon = css`
  position: absolute;
  top: 4px;
  left: 2px;
  bottom: 0;
  z-index: 1;
`

export const topContainer = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`

export const inputContent = css`
  width: 50%;

  input {
    margin-bottom: 5px;
  }

  @media screen and (max-width: 1024px) {
    width: 100%;
  }
`

export const infoContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 45%;
  border-radius: 8px;
  background: var(--DarkGrey);
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);
  color: var(--White);
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;

  @media screen and (max-width: 1024px) {
    margin-top: 20px;
    width: 100%;
  }
`

export const infoTitle = css`
  color: var(--White);
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
`

export const yellowText = css`
  color: var(--Yellow);
  font-size: 20px;
`

export const smallIcon = css`
  margin-left: 5px;
  width: 16px;
  height: 16px;
`

export const VestTableContent = css`
  display: flex;
  align-items: end;
  text-align: right;

  div:not(:nth-last-child(1)) {
    margin-bottom: 5px;
  }
`

export const bottomVoteContent = css`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  margin: auto auto 0;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);
`

export const bottomVoteTitle = css`
  margin-right: 10px;
  color: var(--Black);
  font-size: 16px;
  font-weight: normal;
  line-height: 1;
`

export const bottomVotePercent = css`
  margin-right: 20px;
  color: var(--AppleGreen);
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
`