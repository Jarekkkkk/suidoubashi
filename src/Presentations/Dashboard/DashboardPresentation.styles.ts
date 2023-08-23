import { css } from '@emotion/css'
import Image from '@/Assets/image'

export const buttonStyle = css`
  background-color: #333;
`

export const sectionA = css`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  max-width: 1480px;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${Image.BackgroundPinkA});
`

export const sectionB = css`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  max-width: 1480px;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${Image.BackgroundPinkB});
`

export const logo = css`
  position: relative;
  width: 100%;
  height: 240px;
  z-index: 1;
`

export const sectionBContent = css`
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 1480px;
  height: calc(100vh - 28px);
  overflow: scroll;
`
export const sectionContent = css`
  margin: 0 auto;
  max-width: 880px;
`

export const twinsContent = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  > span {
    width: calc(100% - 15rem);
  }
`

export const block = css`
  display: flex;
  flex-direction: column;
`

export const titleBlock = css`
  display: flex;
  flex-direction: column;
  width: 15rem;

  svg {
    margin: 0 auto;
    width: 80px;
    height: 80px;
  }
`

export const sloganTitle = css`
  display: block;
  margin-bottom: 36px;
  color: #2977EC;
  font-size: 22px;
  font-weight: bold;
  text-align: left;
  line-height: 1;
`

export const contentTitle = css`
  color: #000;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  line-height: 1;
`

export const contentText = css`
  color: #455A5F;
  font-size: 18px;
  line-height: 1.5;
  text-align: left;
`

export const contentBlock = css`
  margin: 80px auto;
  padding: 32px 28px;
  max-width: 850px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.60);
`