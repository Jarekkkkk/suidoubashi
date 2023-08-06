import { cx } from '@emotion/css'
import * as styles from './index.styles';

interface Props {
  styleType: string,
  text: string,
  onClick: () => void,
  icon?: any,
  disabled?: boolean,
}

const BasicButton = (props: Props) => {
  const {
    styleType, text, onClick, icon,
  } = props;

  return (
    <div>
      <button
        {...props}
        type="submit"
        onClick={onClick}
        className={cx(
          styles.button,
          [styles[`${styleType}`]],
        )}
      >
        {icon && icon}
        {text && <p>{text}</p>}
      </button>
    </div>
  );
}

export default BasicButton;
