import { css } from '@emotion/css'

export const cardContainer = css`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(8px);
`

export const cardContent = css`
  position: relative;
  margin-bottom: 12px;
  width: 276px;
  height: 256px;
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(8px);
  border-radius: 8px 8px 0px 0px;
  overflow: hidden;

  img {
    width: auto;
    height: 100%;
  }
`
export const cardPrev = css`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 1;
  transition: 0.3s;
  cursor: pointer;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 8px 7px 0;
    border-color: transparent #ffffff80 transparent transparent;
  }

  &:hover {
    opacity: 0.8;
  }
`
export const cardNext = css`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.25);
  z-index: 1;
  transition: 0.3s;
  cursor: pointer;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent #ffffff80;
  }

  &:hover {
    opacity: 0.8;
  }
`

export const cardInfo = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const infoContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 80%;

  span {
    color: #2977EC;
    font-size: 28px;
    font-weight: bold;
    line-height: 1;
  }

  &:not(:nth-last-child(1)) {
    margin-bottom: 12px;
  }
`

export const valueText = css`
  width: 3rem;
  font-size: 12px;
  font-weight: bold;
  color: #303133;
  margin-right: 14px;
`

export const levelContent = css`
  display: flex;
  align-items: end;
  justify-content: center;
`

export const addressContent = css`
  display: flex;
  flex-direction: row;
  color: #2977EC;
  font-size: 10px;

  span {
    margin-right: 8px;
  }
`

export const copyIcon = css`
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`