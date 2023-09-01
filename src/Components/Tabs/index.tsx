import { useState } from 'react'
import cx from 'classnames'

import * as styles from './index.styles'

type Tabprops = {
  id: number
  title: string
  children: any
}

type Props = {
  links: Array<Tabprops>
  styletype?: string // default\ellipse
  isLoading: boolean
}

const Tabs = (props: Props) => {
  const { links, styletype = 'default', isLoading } = props
  const [currTabId, setCurrTabId] = useState(0)

  return (
    <div className={styles.tabs}>
      {styletype === 'default' ? (
        <>
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
          <div className={styles.defaultPanel}>{links[currTabId].children}</div>
        </>
      ) : (
        <>
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
          <div className={styles.ellipsePanel}>{links[currTabId].children}</div>
        </>
      )}
    </div>
  )
}

export default Tabs
