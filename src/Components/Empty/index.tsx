import { Icon } from '@/Assets/icon'
import * as styles from './index.styles'

const EmptyComponent = () => {
  return (
    <div className={styles.emptyContainer}>
      <Icon.LogoIcon />
      <span>No results found.</span>
    </div>
  );
};

export default EmptyComponent;
