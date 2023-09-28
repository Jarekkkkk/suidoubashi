import { css } from '@emotion/css'

export const barContainer = css`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;
  height: 100%;
`

export const loadingContent = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 405px;
  border-radius: 12px;
  background: var(--TransparentWhite);
  backdrop-filter: blur(8px);
`

export const cardLoadingContent = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  min-height: calc(100vh - 485px);
  background-color: var(--TransparentWhite);
  backdrop-filter: blur(8px);
  border-radius: 12px;
`