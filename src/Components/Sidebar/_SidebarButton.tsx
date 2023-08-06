import { Link } from 'react-router-dom';
import * as styles from './index.styles';

interface Props {
  text: string,
  path: string,
  icon?: any,
}

const SidebarButton = (props: Props) => {
  const { text, icon, path } = props;

  return (
    <div className={styles.sidebarButton}>
      <Link to={path}>
        {icon && icon}
        <span>{text}</span>
      </Link>
    </div>
  );
};

export default SidebarButton;
