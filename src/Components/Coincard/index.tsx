import * as styles from './index.styles'
interface Props {
  coinXIcon: any
  coinXName: string
  coinXValue: string
  coinYIcon?: any
  coinYName?: string
  coinYValue?: string
}

const Coincard = (props: Props) => {
  const { coinXIcon, coinXName, coinXValue, coinYIcon, coinYName, coinYValue } =
    props

  return (
    <div className={styles.coincardContainer}>
      {!coinYIcon ? (
        <>
          {coinXIcon && coinXIcon}
          <div className={styles.coinname}>{coinXName}</div>
          <div className={styles.coninvalue}>
            <span>{coinXValue}</span>
          </div>
        </>
      ) : (
        <>
          <div className={styles.lpContent}>
            <div className={styles.coinCombin}>
              {coinXIcon && coinXIcon}
              {coinYIcon && coinYIcon}
            </div>
            <div className={styles.lpName}>
              {coinXName}/{coinYName}
            </div>
          </div>
          <div className={styles.lpvalueContent}>
            <span>{coinXName}</span>
            <div>{coinXValue}</div>
            <span>{coinYName}</span>
            <div>{coinYValue}</div>
          </div>
        </>
      )}
    </div>
  )
}

export default Coincard
