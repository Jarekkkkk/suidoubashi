import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import * as styles from './index.styles';

interface Props {
  selected: Date,
  onChange: (e: any) => void,
}

const DatePickerComponent = (props: Props) => {
  const { onChange } = props;

  return (
    <DatePicker
      {...props}
      onChange={onChange}
      className={styles.datePickerComponent}
    />
  );
};

export default DatePickerComponent;
