import { css } from '@emotion/css'

export const prevButton = css`
  display: flex;
  position: absolute;
  left: 10px;
  border-radius: 50%;
`

export const liquidityContainer = css`
  display: flex;
  align-items: start;
  padding: 10px;
  overflow: scroll;
  height: calc(100% - 150px);

  @media screen and (max-width: 1240px) {
    flex-direction: column-reverse;
  }
`

export const leftContent = css`
  flex: 1 1 40%;

  @media screen and (max-width: 1240px) {
    width: 100%;
  }
`

export const rightContent = css`
  flex: 1 1 60%;
  height: 100%;

  @media screen and (max-width: 1240px) {
    width: 100%;
  }
`

export const shadowContent = css`
  margin: 10px;
  align-items: center;
  padding: 16px 40px;
  border-radius: 8px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
`

export const inputContent = css`
  margin: 25px 0;
`

export const title = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  font-size: 20px;
  line-height: 32px;

  svg {
    width: 32px;
    height: 32px;

    path {
      fill: #2977EC;
    }
  }
`

export const coinContent = css`
  width: 100%;

  svg {
    width: 32px;
    height: 32px;
  }
`

export const coinBlock = css`
  margin: 10px 0;
  justify-content: space-between;
`

export const buttonContent = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 30px;

  button:nth-child(2) {
    margin-top: 10px;
  }
`

export const infoContent = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`

export const textMarginLeft = css`
  margin-left: 5px;
`
