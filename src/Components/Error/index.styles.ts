import { css } from '@emotion/css'

export const errorContent = css`
  display: flex;
  align-items: end;
  justify-content: center;
  border-radius: 8px;

  span {
    color: var(--AppleRed);
    font-size: 13px;
    font-weight: bold;
    line-height: 1;
  }

  svg {
    margin-right: 8px;
    width: 16px;
    height: 16px;

    path {
      fill: var(--AppleRed);
    }
  }
`