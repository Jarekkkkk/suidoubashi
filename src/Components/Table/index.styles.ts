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
  }

  thead {
    color: var(--Grey);
    font-size: 12px;

    tr > th {
      position: relative;

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