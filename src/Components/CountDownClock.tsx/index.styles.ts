import { css } from '@emotion/css'

export const infoContent = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 45%;
  border-radius: 8px;
  background: var(--DarkGrey);
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);
  color: var(--White);
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;

  @media screen and (max-width: 1024px) {
    margin-top: 20px;
    width: 100%;
  }
`

export const infoTitle = css`
  color: var(--White);
  font-size: 28px;
  font-weight: bold;
  line-height: 1;
`

export const yellowText = css`
  color: var(--Yellow);
  font-size: 20px;
`
