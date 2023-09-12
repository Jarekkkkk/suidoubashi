import { Empty } from '@/Components'
import * as styles from './index.styles'
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { JSX } from 'react/jsx-runtime';

type TableProps = {
  data: Array<any>,
  columns: any,
  renderRow: any,
}

const Table = (props: TableProps) => {
  const { data, columns, renderRow } = props;

  console.log('data', data)
  return (
    !data.length ? (
      <Empty content='Oops! No Data.' />
    ) : (
      <div className={styles.TableWrapper}>
        <table>
          <thead>
            <tr>
              {columns.map((column: { id: Key | null | undefined; Header: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                <th  key={column.id}>{column.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderRow.map((row: { id: Key | null | undefined; map: (arg0: (rowValue: any) => JSX.Element) => string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
              <tr key={row.id}>
                {
                  row.map((rowValue: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined) => (
                    <td>{rowValue}</td>
                  ))
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  );
};

export default Table;
