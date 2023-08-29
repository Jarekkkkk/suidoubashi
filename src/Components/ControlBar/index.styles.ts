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
  background: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(8px);
`

export const cardLoadingContent = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  margin-bottom: 4px;
`