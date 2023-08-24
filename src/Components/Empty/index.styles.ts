import { css } from '@emotion/css'

export const emptyContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px auto;

  svg {
    width: 50px;
    height: 50px;
  }

  span {
    margin-top: 30px;
    color: #6F7175;
    font-size: 12px;
    font-weight: bold;
  }
`