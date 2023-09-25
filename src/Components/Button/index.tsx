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
  isloading?: number,
}

const BasicButton = (props: Props) => {
  const {
    styletype, text, onClick, icon, small, isloading, disabled, medium,
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
        },
      )}
      disabled={!!isloading || disabled}
    >
      {icon && icon}
      {text && <p>{text}</p>}
      {!!isloading && <Spinner />}
    </button>
  );
}

export default BasicButton;
