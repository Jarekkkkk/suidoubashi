import { css } from '@emotion/css'

export const sidebarContainer = css`
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
    transition: 0.3s;
  }

  svg {
    margin-right: 12px;
    width: 24px;
    height: 24px;

    path {
      fill: #595959;
      transition: 0.3s;
    }
  }

  &:hover {
    a {
      color: #2977EC;
    }

    svg {
      path {
        fill: #2977EC;
      }
    }
  }
`;

export const active  = css`
  a {
    color: #2977EC;
  }

  svg {
    path {
      fill: #2977EC;
    }
  }
`;

export const logoContent = css`
  margin-bottom: 46px;
  transition: 0.3s;

  &:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }
`;