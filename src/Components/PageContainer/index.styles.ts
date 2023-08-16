import { css } from '@emotion/css'

export const pageContainer = css`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
`

export const titleSection = css`
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
`

export const title = css`
  display: flex;
  align-items: center;
  justify-content: left;
  position: relative;
  padding-left: 60px;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #012B52 0%, rgba(1, 78, 82, 0.00) 100%);
  color: #fff;
  font-size: 48px;
  font-weight: 900;
  line-height: 1;
  z-index: 1;
`

export const titleImg = css`
  position: absolute;
  top: 0;
  right: 0;
  width: auto;
  height: 100%;
  z-index: 0;
`