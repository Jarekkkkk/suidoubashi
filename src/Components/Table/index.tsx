import { Empty } from '@/Components'
import * as styles from './index.styles'
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from 'react'
import { JSX } from 'react/jsx-runtime'

type TableProps = {
  data: Array<any>
  columns: any
  renderRow: any
}

const Table = (props: TableProps) => {
  const { data, columns, renderRow } = props

  return !data.length ? (
    <Empty content='Oops! No Data.' />
  ) : (
    <div className={styles.TableWrapper}>
      <table>
        <thead>
          <tr style={{backgroundColor: "#2977EC", color: "white"}}>
            {columns.map(
              (column: {
                id: Key | null | undefined
                Header:
                  | string
                  | number
                  | boolean
                  | ReactElement<any, string | JSXElementConstructor<any>>
                  | Iterable<ReactNode>
                  | ReactPortal
                  | null
                  | undefined
              }) => (
                <th key={column.id}>{column.Header}</th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {renderRow.map(
            (row: {
              id: Key | null | undefined,
              map(arg0: (rowValue: any, idx: any) => JSX.Element): ReactNode,
            }, idx: Key | null | undefined) => (
              <tr key={idx}>
                {row.map((rowValue, idx) => <td key={idx}>{rowValue}</td>)}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
