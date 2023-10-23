import { css } from '@emotion/css'

export const rewardsWrapper = css`
  display: flex;
  flex-direction: row;
  padding: 20px;
  height: calc(100% - 140px);
`

export const stakeContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin-right: 10px;
  padding: 12px;
  height: 100%;
  width: calc(50% - 10px);
  border-radius: 12px;
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);
`

export const votingContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin-left: 10px;
  padding: 12px;
  height: 100%;
  width: calc(50% - 10px);
  border-radius: 12px;
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);
`

export const title = css`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: var(--DarkGrey);
  font-size: 20px;
  font-weight: bold;
  line-height: 1;

  svg {
    width: 32px;

    path {
      fill: var(--Brand);
    }
  }
`

export const rewardsCard = css`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
  padding: 10px 12px;
  width: 100%;
  border-radius: 12px;
  background-color: var(--White);
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);

  span {
    display: flex;
    justify-content: start;
    align-items: center;
    margin-bottom: 10px;
    width: 50%;
    font-size: 16px;
    font-weight: bold;
  }

  @media screen and (max-width: 1180px) {
    flex-direction: column;
    flex-wrap: wrap;

    button {
      margin-top: 0px;
    }

    > div:not(:nth-last-child(1)) {
      margin-bottom: 10px;
    }
  }
`

export const bridesText = css`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 8px;
  color: var(--DarkGrey);
  font-size: 16px;
  font-weight: bold;
  line-height: 1;

  svg {
    margin-right: 3px;
    width: 24px;
    height: 24px;
  }

  @media screen and (max-width: 1180px) {
    :nth-last-child(1) {
      margin-bottom: 0px;
    }
  }
`
export const smallIcon = css`
  margin-left: 5px;
  width: 24px;
  height: 24px;

  svg {
    width: 24px;
    height: 24px;
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
  background: var(--White);
`
