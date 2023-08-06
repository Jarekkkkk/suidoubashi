import { css } from '@emotion/css'

export const sidebarContainer = css`
  position: absolute;
  left: 15px;
  top: 15px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 28px 24px;
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

export const logoItem = css`
  margin: 0 auto 30px auto;
  width: 84px;
`

export const sidebarButton = css`
  display: block;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: bold;
  line-height: 1;

  a {
    display: flex;
    align-items: center;
    color: #595959;
    text-decoration-line: unset;
  }

  svg {
    margin-right: 12px;
    width: 24px;
    height: 24px;
  }
`;

export const sidebarButtonIcon = css``;