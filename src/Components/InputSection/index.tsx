import { ReactNode } from 'react'
import * as styles from './index.styles'

type Props = {
  balance?: number
  titleChildren: ReactNode
  inputChildren: ReactNode
}

const InputSection = (props: Props) => {
  const { titleChildren, balance, inputChildren } = props

  return (
    <div className={styles.inputSection}>
      <div className={styles.titleBlock}>
        <div className={styles.title}>{titleChildren}</div>
        {balance && (
          <div className={styles.balance}>
            Balance
            <span>{balance}</span>
          </div>
        )}
      </div>
      {inputChildren}
    </div>
  )
}

export default InputSection
