import { cx } from '@emotion/css'
import { Spinner } from '@blueprintjs/core'
import * as styles from './index.styles';
import { types } from './index.styles';
interface Props {
  styletype: string, // filled | outlined | tonal
  text: string,
  onClick?: () => void,
  icon?: any,
  disabled?: boolean,
  small?: boolean, // small
  medium?: boolean, // medium
  isLoading?: boolean,
}

const BasicButton = (props: Props) => {
  const {
    styletype, text, onClick, icon, small, isLoading, disabled, medium,
  } = props;

  return (
    <button
      {...props}
      type="submit"
      onClick={onClick}
      className={cx(
        styles.button,
        types[styletype],
        {
          [styles.smallButton]: small,
          [styles.mediumButton]: medium,
        }
      )}
      disabled={isLoading || disabled}
    >
      {icon && icon}
      {text && <p>{text}</p>}
      {isLoading && <Spinner />}
    </button>
  );
}

export default BasicButton;
