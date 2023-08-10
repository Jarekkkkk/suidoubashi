import { css } from '@emotion/css'
import Image from '@/Assets/image'

export const layoutContainer = css`
  position: relative;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${Image.Background});
`

export const mainContent = css`
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 0px;
  left: 155px;
  width: calc(100vw - 155px);
  height: 100vh;
  overflow: auto;
`