import { css } from '@emotion/css'

export const sidebarContainer = css`
  position: absolute;
  left: 15px;
  top: 15px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 30px;
  width: 140px;
  height: 80%;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 5px #00000014;
  background-color: rgba(255, 255, 255, 0.70);

  &.sidebarWide {
    width: 140px;
  }
`

export const sidebarItem = css`
  display: block;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  font-size: 13px;
  font-style: normal;
  font-weight: 900;
  line-height: 1;

  a {
    color: #909399;
    text-decoration-line: unset;
  }
`

export const logoItem = css`
  margin: 0 auto 30px auto;
  width: 84px;
`