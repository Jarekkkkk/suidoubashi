import { css } from '@emotion/css'

export const settingContainer = css`
  position: relative;
`

export const informationButton = css`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 36px;
  height: 36px;
  z-index: 2;
  transition: 0.3s;

  &:hover {
    opacity: 0.9;
  }
`
