import { css, keyframes } from '@emotion/css'

export const wrap = css`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const swimUp = keyframes`
  0% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(0deg);
  }
`

export const fishContent = css`
  position: relative;
  width: 100px;
  height: 80px;
  animation: ${swimUp} 2s linear infinite;
`

export const fishDown = css`
  margin-right: 20px;
`

export const fishUp =css`
  position: absolute;
  margin-left: 20px;
`