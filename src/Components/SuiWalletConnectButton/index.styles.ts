import { css } from '@emotion/css'

export const buttonStyle = css`
  background-color: var(--Black);
  transition: 0.3s;

  &:hover {
    background-color: var(--Brand);
    box-shadow: 0 0 10px var(--TransparentWhite);
  }
`