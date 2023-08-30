import { css } from '@emotion/css'

export const settingContainer = css`
  width: 420px;
  height: 380px;
  flex-shrink: 0;
`

export const settingLayout = css`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 28px;
`

export const settingSection = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  h1 {
    color: #000;
    font-family: Aileron;
    font-size: 24px;
    font-style: normal;
    font-weight: 900;
    line-height: 24px; /* 100% */
  }
`

export const settingTitle = css`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const settingButtons = css`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`

export const informationIcon = css`
  width: 20px;
  height: 20px;
`
