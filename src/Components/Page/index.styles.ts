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
  justify-content: space-between;
  position: relative;
  margin: 0 auto;
  padding: 14px 12px;
  width: 100%;
  max-width: 1480px;
  height: 100vh;
  overflow: hidden;
`

export const content = css`
  margin: 0 12px;
  width: 100%;
  min-width: 320px;
  height: calc(100vh - 28px);
  overflow: scroll;
`

export const dashboardMainContent = css`
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 1480px;
`

export const sidebarContent = css`
  position: fixed;
  margin-top: 14px;
  margin-left: 12px;
  z-index: 5;
`