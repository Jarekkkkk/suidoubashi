import { Link } from 'react-router-dom';
import * as styles from './index.styles';
import { cx } from '@emotion/css';

interface Props {
  text: string,
  path: string,
  icon?: any,
  active: boolean,
}

const SidebarButton = (props: Props) => {
  const { text, icon, path, active } = props;

  return (
    <div className={cx(styles.sidebarButton, { [styles.active]: active })}>
      <Link to={path}>
        {icon && icon}
        <span>{text}</span>
      </Link>
    </div>
  );
};

export default SidebarButton;
