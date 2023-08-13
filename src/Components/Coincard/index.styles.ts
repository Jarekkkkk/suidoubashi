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
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);

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
  color: #000;
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
  color: #000;
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
    color: #A4A8B2;
    font-size: 12px;
    font-weight: normal;
    line-height: 1;
  }
`