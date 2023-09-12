
import * as styles from './index.styles'

type TableProps = {
  data: Array<any>,
  columns: any,
  renderRow: any,
}

const Table = (props: TableProps) => {
  const { columns, renderRow } = props;
  
  return (
    <div className={styles.TableWrapper}>
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th  key={column.id}>{column.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {renderRow.map(row => (
            <tr key={row.id}>
              {
                row.map((rowValue) => (
                  <td>{rowValue}</td>
                ))
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
