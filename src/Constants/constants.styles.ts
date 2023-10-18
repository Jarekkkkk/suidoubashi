import { css } from '@emotion/css'

export const LoadingContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 30px auto;
  padding: 0 30px;
  height: calc(100% - 140px - 60px);
`

export const rowContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const columnContent = css`
  display: flex;
  flex-direction: column;
`

export const boldText = css`
  display: flex;
  align-items: center;
  color: var(--Black);
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
`

export const greyText = css`
  display: flex;
  align-items: center;
  color: var(--Grey);
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
`

export const lightGreyText = css`
  display: flex;
  align-items: center;
  color: var(--LightGrey);
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
`
