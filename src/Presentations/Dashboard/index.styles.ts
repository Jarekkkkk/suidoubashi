import { css } from '@emotion/css'
import Image from '@/Assets/image'

export const buttonStyle = css`
  background-color: var(--Black);
`

export const sectionA = css`
  position: relative;
  background-size: 150%;
  background-position: bottom center;
  background-repeat: no-repeat;
  background-image: url(${Image.BackgroundPinkA});
  overflow: hidden;
  box-sizing: border-box;
  height: 100vh;

  @media screen and (max-width: 768px) {
    background-size: cover;
  }
`

export const sectionB = css`
  position: relative;
  background-size: 150%;
  background-position: top center;
  background-repeat: no-repeat;
  background-image: url(${Image.BackgroundPinkB});
  overflow: hidden;
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    background-size: cover;
  }
`

export const sectionContainer = css`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  max-width: 1480px;
  width: 100%;
  height: 100%;


  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`

export const logo = css`
  position: relative;
  margin-top: 150px;
  width: 100%;
  height: 240px;
  z-index: 1;


  @media screen and (max-width: 768px) {
    margin-top: 0;
  }
`

export const sectionBContent = css`
  position: relative;
  width: 580px;

  @media screen and (max-width: 768px) {
    max-width: 320px;
  }
`

export const TitleGreen = css`
  margin-top: 80px;
  color: var(--BrandDark);
  text-align: center;
  text-shadow: 0px -4px 6px rgba(255, 255, 255, 0.7);
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
`

export const TitleWhite = css`
  margin-top: 80px;
  color: var(--BrandLight);
  text-align: center;
  text-shadow: 0px -4px 6px rgba(229, 254, 255, 0.65);
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
`

export const SecondTitleGreen = css`
  color: var(--BrandDark);
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
`

export const SecondTitleWhite = css`
  color: var(--BrandLight);
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
`

export const ContentGreen = css`
  margin-top: 8px;
  color: var(--BrandDark);
  font-size: 14px;
  font-weight: normal;
  line-height: 1;
`

export const ContentWhite = css`
  margin-top: 8px;
  color: var(--BrandLight);
  font-size: 14px;
  font-weight: normal;
  line-height: 1;
`
