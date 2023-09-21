import { css } from '@emotion/css'

export const tabs = css`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

export const tabList = css`
  display: flex;
  flex-direction: row;
  align-items: end;
`;

export const defaultTabTitle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  height: 32px;
  color: var(--Grey);
  font-size: 20px;
  font-weight: bold;
  border-radius: 12px 12px 0px 0px;
  background-color: var(--TransparentWhite);
  backdrop-filter: blur(8px);
  cursor: pointer;
`;

export const defaultActiveTab = css`
  color: var(--White);
  background-color: rgba(96, 98, 102, 0.90) !important;
  transition: 0.3s;
`;

export const ellipseTabList = css`
  background-color: rgba(96, 98, 102, 0.25);
  border-radius: 12px;
  transition: 0.3s;
`

export const ellipseTabTitle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  height: 40px;
  color: var(--Grey);
  font-size: 20px;
  font-weight: bold;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: 0.3s;
`

export const ellipseActiveTab = css`
  color: var(--White) !important;
  background-color: var(--Brand)  !important;
  transition: 0.3s;
`;

export const defaultPanel = css`
  padding: 14px;
  max-height: calc(100vh - 485px);
  min-height: 50px;
  background-color: var(--TransparentWhite);
  backdrop-filter: blur(8px);
  border-radius: 0px 0px 12px 12px;
  overflow-x: scroll;
`;

export const ellipsePanel = css`
  padding: 14px;
  background-color: var(--TransparentWhite);
  backdrop-filter: blur(8px);
  border-radius: 0px 0px 12px 12px;
  overflow-x: scroll;
`;