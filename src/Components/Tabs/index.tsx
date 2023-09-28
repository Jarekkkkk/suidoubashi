import { useState } from 'react'
import cx from 'classnames'

import { Loading } from '@/Components'
import * as constantsStyles from '@/Constants/constants.styles'
import * as styles from './index.styles'

type Tabprops = {
  id: number
  title: string
  children: any
}

type Props = {
  links: Array<Tabprops>
  styletype: string // default\ellipse
  isLoading: boolean
}

const Tabs = (props: Props) => {
  const { links, styletype, isLoading } = props
  const [currTabId, setCurrTabId] = useState(0)

  if (isLoading) {
    return (
      <div className={styles.tabs}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.tabs}>
      {styletype === 'default' ? (
        <div className={styles.tabList}>
          {Array.isArray(links) &&
            links.map((item) => (
              <span
                key={item.id}
                onClick={() => !isLoading && setCurrTabId(item.id)}
                className={cx(styles.defaultTabTitle, {
                  [styles.defaultActiveTab]: item.id === currTabId,
                })}
              >
                {item.title}
              </span>
            ))}
        </div>
      ) : (
        <div className={cx(styles.tabList, styles.ellipseTabList)}>
          {Array.isArray(links) &&
            links.map((item) => (
              <span
                key={item.id}
                onClick={() => !isLoading && setCurrTabId(item.id)}
                className={cx(styles.ellipseTabTitle, {
                  [styles.ellipseActiveTab]: item.id === currTabId,
                })}
              >
                {item.title}
              </span>
            ))}
        </div>
      )}
      <div className={cx(styles.ellipsePanel, {
        [styles.defaultPanel]: styletype === 'default',
        [styles.ellipsePanel]: styletype === 'ellipse'
      })}>
        {links[currTabId].children}
      </div>
    </div>
  )
}

export default Tabs
