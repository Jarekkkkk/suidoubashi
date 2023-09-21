import { css } from '@emotion/css'

export const sidebarContainer = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  padding: 28px 24px;
  width: 140px;
  height: 80%;
  min-height: 80vh;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  box-sizing: border-box;
  box-shadow: 0px 0px 10px 5px var(--TransparentBlack);
  background-color: var(--TransparentWhite);

  &.sidebarWide {
    width: 140px;
  }
`

export const logoItem = css`
  margin: 0 auto 30px auto;
  width: 84px;
`

export const sidebarButtonContent = css`
  display: flex;
  align-items: center;
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

  a, span {
    display: flex;
    align-items: center;
    color: var(--Grey);
    text-decoration-line: unset;
    transition: 0.3s;
    outline: none !important;
  }

  svg {
    margin-right: 12px;
    width: 24px;
    height: 24px;

    path {
      fill: var(--Grey);
      transition: 0.3s;
    }
  }

  &:hover {
    cursor: pointer;

    a, span {
      color: var(--Brand);
    }

    svg {
      path {
        fill: var(--Brand);
      }
    }
  }
`;

export const active  = css`
  a, span {
    color: var(--Brand);
  }

  svg {
    path {
      fill: var(--Brand);
    }
  }
`;

export const logoContent = css`
  margin-bottom: 46px;
  transition: 0.3s;
  outline: none !important;

  a {
    outline: none !important;
  }

  &:hover {
    opacity: 0.85;
    transform: scale(1.05);
  }
`;

export const footerContent = css`
  margin-top: auto;

  span {
    display: block;
    margin-top: 20px;
    width: 100%;
    text-align: center;
    color: var(--Brand);
  }
`

export const footerIconBlock = css`
  display: flex;
  justify-content: space-around;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
    transition: 0.3s;

    &:hover {
      opacity: 0.85;
      transform: scale(1.05);
    }
  }

  a {
    outline: none !important;
  }
`