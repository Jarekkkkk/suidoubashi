import { css } from '@emotion/css'

export const coincardContainer = css`
  display: flex;
  align-items: center;
  padding: 24px 20px;
  background: rgba(255, 255, 255, 0.90);
  border-radius: 12px;
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25);
`
export const coinname = css`
  margin-left: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  line-height: 1;
`
export const coninvalue = css`
  position: relative;
  margin-left: 50px;
  font-size: 20px;
  font-weight: bold;
  color: #000;
  line-height: 1;

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