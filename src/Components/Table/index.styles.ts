import { css } from '@emotion/css'

export const TableWrapper = css`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  max-height: calc(100vh - 350px);
  border-radius: 12px;
  background: var(--White);
  box-shadow: 0px 0px 4px 0px var(--TransparentBlack);
  overflow: auto;

  table {
    padding-top: 16px;
    background-color: var(--Brand);
    border-spacing: 0px;
  }

  thead {
    position: sticky;
    top: 0;
    color: var(--White);
    background-color: var(--Brand);
    font-size: 12px;
    line-height: 2;
    z-index: 10;

    tr > th {
      position: relative;
      padding-bottom: 5px;

      :after {
        content: '';
        position: absolute;
        left: -5px;
        display: flex;
        padding-top: 5px;
        width: calc(100% + 5px);
        border-bottom: 1px solid var(--LightGrey);
      }
    }
  }

  tbody {
    background-color: var(--White);
  }

  td {
    padding: 12px 24px;
  }
`

export const rowContainer = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  > div {
    flex: 1 1 auto;
  }
`