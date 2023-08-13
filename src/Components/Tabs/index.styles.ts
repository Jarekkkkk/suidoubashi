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

export const tabTitle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  height: 32px;
  color: #606266;
  font-size: 20px;
  font-weight: bold;
  border-radius: 12px 12px 0px 0px;
  background-color: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(8px);
  cursor: pointer;
`;

export const activeTab = css`
  height: 40px !important;
  color: #FFF;
  background-color: rgba(96, 98, 102, 0.90) !important;
`;

export const panel = css`
  padding: 14px;
  max-height: calc(100vh - 485px);
  min-height: 50px;
  background-color: rgba(255, 255, 255, 0.70);
  backdrop-filter: blur(8px);
  border-radius: 0px 0px 12px 12px;
  overflow-x: scroll;
`;