import { css } from '@emotion/css'

export const cardContainer = css`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 12px;
  background: var(--TransparentWhite);
  backdrop-filter: blur(8px);
`

export const cardContent = css`
  position: relative;
  margin-bottom: 12px;
  width: 276px;
  height: 256px;
  background: var(--TransparentWhite);
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
  background-color: var(--TransparentBlack);
  z-index: 1;
  transition: 0.3s;
  cursor: pointer;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 8px 7px 0;
    border-color: transparent var(--TransparentWhite) transparent transparent;
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
  background-color: var(--TransparentBlack);
  z-index: 1;
  transition: 0.3s;
  cursor: pointer;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 7px 0 7px 8px;
    border-color: transparent transparent transparent var(--TransparentWhite);
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
    color: var(--Brand);
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
  color: var(--Black);
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
  margin: 0 auto;
  width: 80%;
  color: var(--Brand);
  font-size: 10px;
  width: 100%;
  overflow: hidden;
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

export const copyIcon = css`
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.6;
  }
`