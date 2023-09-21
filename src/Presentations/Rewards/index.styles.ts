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
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);

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
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);

`

export const title = css`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #3F4247;
  font-size: 20px;
  font-weight: bold;
  line-height: 1;

  svg {
    width: 32px;

    path {
      fill: #2977EC;
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
  background-color: #FFF;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);

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
  justify-content: center;
  margin-bottom: 8px;
  color: #3F4247;
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