import { css } from '@emotion/css';

export const dialogComponent = css`
  position: relative;
  padding-bottom: 0 !important;
  width: 552px !important;
  max-height: calc(100vh - 60px);
  background: #fff !important;
  border-radius: 12px;
  overflow: hidden;

  :global(.bp3-dialog-header) {
    box-shadow: none;
    padding: 12px 20px;

    h4 {
      font-size: 17px;
      line-height: 24px;
      color: #222;
    }
  }
`

export const body = css`
  padding: 20px;
  height: 100%;
  min-height: 200px; // for init testing
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  overflow: auto;

`
export const titleSection = css`
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
`

export const title = css`
  display: flex;
  align-items: center;
  justify-content: left;
  position: relative;
  padding-left: 60px;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #012B52 0%, rgba(1, 78, 82, 0.00) 100%);
  color: #fff;
  font-size: 48px;
  font-weight: 900;
  line-height: 1;
  z-index: 1;
`

export const titleImg = css`
  position: absolute;
  top: 0;
  right: 0;
  width: auto;
  height: 100%;
  z-index: 0;
`

export const closeButton = css`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 2;
  transition: 0.3s;

  &:hover {
    opacity: 0.9;
  }
`

export const disableButton = css`
  opacity: 0.8;

  path {
    fill: #a4a8b2;
  }
`

export const settingTitle = css`
  background: none;
`

export const settingImg = css`
  left: 0;
  width: 100%;
`