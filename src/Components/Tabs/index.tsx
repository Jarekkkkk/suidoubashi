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
  styletype?: string, // default\ellipse
};

const Tabs = (props: Props) => {
  const { links, styletype='default' } = props;
  const [currTabId, setCurrTabId] = useState(0);

  return (
    <div className={styles.tabs}>
      <div
        className={cx(styles.tabList, {
          [styles.ellipseTabList]: styletype === 'ellipse',
        })}
      >
        {
          Array.isArray(links) && links.map((item) => (
            <span
              key={item.id}
              onClick={() => setCurrTabId(item.id)}
              className={cx(
                {
                  [styles.defaultTabTitle]: styletype === 'default',
                  [styles.ellipseTabTitle]: styletype === 'ellipse',
                  [styles.defaultActiveTab]: styletype === 'default' && item.id === currTabId,
                  [styles.ellipseActiveTab]: styletype === 'ellipse' && item.id === currTabId,
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
