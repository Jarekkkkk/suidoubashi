import { cx } from '@emotion/css'
import * as styles from './index.styles';
import { types } from './index.styles';
interface Props {
  styletype: string, // filled | outlined | tonal
  text: string,
  onClick: () => void,
  icon?: any,
  disabled?: boolean,
}

const BasicButton = (props: Props) => {
  const {
    styletype, text, onClick, icon,
  } = props;

  return (
    <div>
      <button
        {...props}
        type="submit"
        onClick={onClick}
        className={cx(
          styles.button,
          types[styletype],
        )}
      >
        {icon && icon}
        {text && <p>{text}</p>}
      </button>
    </div>
  );
}

export default BasicButton;
