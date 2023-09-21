import { css } from '@emotion/css'

export const datePickerComponent = css`
  padding: 1px 8px;
  width: 100%;
  height: 48px;
  color: var(--Brand);
  border: 1px solid var(--Grey);
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  outline: none;

  :focus-visible {
    border-color: var(--Brand);
  }

  &:disabled {
    color: var(--TransparentBlack);
    background: var(--TransparentWhite);
  }
`