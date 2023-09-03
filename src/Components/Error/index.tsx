import { Icon } from '@/Assets/icon'
import * as styles from './index.styles'

type Props = {
  errorText: string,
}

const Error = (props: Props) => {
  const { errorText } = props;

  return (
    <div className={styles.errorContent}>
      <Icon.WarningSignIcon />
      <span>{errorText}</span>
    </div>
  );
};

export default Error;
