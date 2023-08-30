import { cx } from '@emotion/css'
import * as styles from './index.styles';
import { types } from './index.styles';
interface Props {
  styletype: string, // filled | outlined | tonal
  text: string,
  onClick: () => void,
  icon?: any,
  disabled?: boolean,
  small?: boolean, // small
}

const BasicButton = (props: Props) => {
  const {
    styletype, text, onClick, icon, small,
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
        }
      )}
    >
      {icon && icon}
      {text && <p>{text}</p>}
    </button>
  );
}

export default BasicButton;
