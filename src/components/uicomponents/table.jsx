import styles from './table.module.css';


const Table = ({ tableData }) => {

  const theading = [];

  for(let i = 0; i < tableData.title.length; i++) {
    theading.push
    (
        <th key={i} style={tableData.stylesTh[`${i}`]} >{tableData.title[i]}</th>
    )
  }

  let cols = [];
  let rows =[];

  for(let i = 0; i < tableData.rows?.length; i++) {
    for(let j = 0; j < tableData.title.length; j++) {
        cols.push
        (
            <td key={j} style={tableData.stylesTd[`${j}`]}>
                {tableData.rows[i][j]}
            </td>
        )
    }
    rows.push(<tr style={tableData.tr}>{cols}</tr>);
    //reset columns
    cols = [];
  }

  return (
        <table className={styles.container}>
            <thead>
                <tr>
                    {theading}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
  )
}

export default Table



