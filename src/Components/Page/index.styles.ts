import { css } from '@emotion/css'

export const layoutContainer = css`
  position: relative;
`

export const mainContent = css`
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 0px;
  left: 240px;
  width: calc(100vw - 240px);
  height: 100vh;
  overflow: auto; // for extend height from children's height, ref. https://stackoverflow.com/q/384145/2281129
`