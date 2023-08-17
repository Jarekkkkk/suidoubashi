import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import * as styles from './index.styles';

interface Props {
  startDate: Date | null,
  handleOnChange: (date: any) => void,
}

const DatePickerComponent = (props: Props) => {
  const { startDate, handleOnChange } = props;

  return (
    <DatePicker
      {...props}
      selected={startDate}
      onChange={handleOnChange}
      className={styles.datePickerComponent}
      dateFormat="yyyy/MM/dd"
    />
  );
};

export default DatePickerComponent;
