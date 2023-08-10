import { useState } from 'react';
import cx from 'classnames';

import * as styles from './index.styles';

type Tabprops = {
  id: number,
  title: string,
  children: any,
};

type Props = {
  links: Array<Tabprops>,
};

const Tabs = (props: Props) => {
  const { links } = props;
  const [currTabId, setCurrTabId] = useState(0);

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList}>
        {
          Array.isArray(links) && links.map((item) => (
            <span
              key={item.id}
              onClick={() => setCurrTabId(item.id)}
              className={cx(
                styles.tabTitle,
                {
                  [styles.activeTab]: item.id === currTabId,
                },
              )}
            >
              {item.title}
            </span>
          ))
        }
      </div>
      <div className={styles.panel}>
        {links[currTabId].children}
      </div>
    </div>
  )
};

export default Tabs;
