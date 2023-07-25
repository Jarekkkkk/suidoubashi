import { css } from '@emotion/css'

export const sidebarContainer = css`
  display: flex;
  flex-wrap: wrap;
  width: 240px;
  /* height: 100vh; */
  background-color: #eee;

  &.sidebarWide {
    width: 240px;
  }
`

export const sidebarItem = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 240px;
  height: 36px;
`