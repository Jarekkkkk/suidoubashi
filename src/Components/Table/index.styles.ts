import { css } from '@emotion/css'

export const TableWrapper = css`
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  max-height: calc(100vh - 350px);
  border-radius: 12px;
  background: #FFF;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  overflow: auto;

  table {
    padding-top: 16px;
  }

  thead {
    color: #606266;
    font-size: 12px;
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