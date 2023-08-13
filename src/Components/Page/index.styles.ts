import { css } from '@emotion/css'
import Image from '@/Assets/image'

export const layoutContainer = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${Image.Background});
`

export const mainContent = css`
  display: flex;
  flex-direction: row;
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 1480px;
  height: 100vh;
  overflow: auto;
`

export const content = css`
  margin: 0 12px;
  max-width: 800px;
  width: 100%;
  height: 100%;
`