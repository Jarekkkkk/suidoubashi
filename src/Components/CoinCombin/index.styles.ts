import { css } from '@emotion/css'

export const coinCombin = css`
  position: relative;
  width: 54px;
  text-align: left;

  svg {
    width: 32px;
    height: 32px;
  }

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

export const poolContent = css`
  min-width: 150px;
`
