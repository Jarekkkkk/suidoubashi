import { Link } from 'react-router-dom';
import * as styles from './index.styles';
import { cx } from '@emotion/css';

interface Props {
  text: string,
  path?: string,
  icon?: any,
  active: boolean,
  onClick?: () => void,
}

const SidebarButton = (props: Props) => {
  const { text, icon, path, active, onClick } = props;

  return (
    <div className={cx(styles.sidebarButton, { [styles.active]: active })} onClick={onClick}>
      {
        path ? (
          <Link className={styles.sidebarButtonContent} to={path}>
            {icon && icon}
            <span>{text}</span>
          </Link>
        ) : (
          <div className={styles.sidebarButtonContent}>
            {icon && icon}
            <span>{text}</span>
          </div>
        )
      }
    </div>
  );
};

export default SidebarButton;
