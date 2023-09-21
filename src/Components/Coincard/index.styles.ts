import { css } from '@emotion/css'

export const coincardContainer = css`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  padding: 24px 20px;
  width: 100%;
  height: auto;
  max-width: 100%;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 12px;
  box-shadow: 0px 0px 2px 0px var(--TransparentBlack);

  svg {
    width: 32px;
    height: 32px;
  }

  &:nth-last-child(1) {
    margin-bottom: 0px;
  }
`
export const coinname = css`
  margin-left: 8px;
  width: 5rem;
  font-size: 16px;
  font-weight: bold;
  color: var(--Black);
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
export const coninvalue = css`
  position: relative;
  margin-left: 30px;
  width: calc(100% - 5rem);
  font-size: 20px;
  font-weight: bold;
  color: var(--Black);
  line-height: 1;

  span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:before {
    content: 'Balance';
    display: inline-block;
    position: absolute;
    top: -13px;
    color: var(--LightGrey);
    font-size: 12px;
    font-weight: normal;
    line-height: 1;
  }
`

export const lpContent = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;

  svg {
    margin-bottom: 4px;
  }
`

export const lpName = css`
  width: 6rem;
  font-size: 16px;
  font-weight: bold;
  color: var(--Black);
  line-height: 1;
`

export const lpvalueContent = css`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  width: 100%;

  div {
    position: relative;
    font-size: 20px;
    font-weight: bold;
    color: var(--Black);
  }

  span {
    font-size: 12px;
    font-weight: normal;
    color: var(--LightGrey);
    line-height: 1;

    &:nth-child(3) {
      margin-top: 6px;
    }
  }
`

export const coinCombin = css`
  position: relative;
  width: 100%;
  text-align: left;

  svg:nth-child(1) {
    position: relative;
    z-index: 1;
  }

  svg:nth-last-child(1) {
    position: absolute;
    left: 20px;
    z-index: 0;
  }
`