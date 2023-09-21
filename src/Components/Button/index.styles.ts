import { css } from '@emotion/css'

export const button = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding:13px 6px;
  min-width: 160px;
  height: 40px;
  border-radius: 4px;
  border-style: none;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    outline-offset: 0px;
  }

  p {
    margin: 0;
    font-size: 13px;
    font-weight: bold;
    line-height: 1;
  }

  svg {
    margin-right: 4px;
    width: 24px;
    height: 24px;
  }

  div[class*='bp5-spinner'] {
    margin-left: 5px;
    width: 16px;
    height: 16px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`

export const smallButton = css`
  min-width: 60px;
`

export const mediumButton = css`
  min-width: 90px;
`

export const filled = css`
  background-color: var(--Brand);

  p {
    color: var(--White);
  }

  &:hover {
    background-color: var(--BrandMediumDark);
  }

  &:disabled {
    cursor: no-drop;
    background-color: var(--LightGrey);
  }
`

export const outlined = css`
  border: 1px solid var(--Brand);
  background-color: var(--White);

  p {
    color: var(--Brand);
  }

  &:hover {
    background-color: var(--BrandLight);
  }

  &:disabled {
    cursor: no-drop;
    border: 1px solid var(--LightGrey);
    background-color: var(--White);

    p {
      color: var(--LightGrey);
    }
  }
`

export const tonal = css`
  border: 1px solid var(--Brand);
  background-color: var(--BrandLight);

  p {
    color: var(--Brand);
  }

  &:hover {
    background-color: var(--BrandLight);
  }

  &:disabled {
    cursor: no-drop;
    border: 1px solid var(--LightGrey);
    background-color: var(--TransparentWhite);

    p {
      color: var(--LightGrey);
    }
  }
`

export const badge = css`
  padding: 2px 13px;
  min-width: auto;
  height: 20px;
  border-radius: 20px;
  background-color: var(--TransparentBlack);

  p {
    color: var(--White);
  }

  &:hover {
    background-color: var(--Yellow);
  }

  &:disabled {
    cursor: no-drop;
    background-color: var(--Yellow);
  }
`

export const types: Record<string, string> = {
  "filled": filled,
  "outlined": outlined,
  "tonal": tonal,
  "badge": badge,
}