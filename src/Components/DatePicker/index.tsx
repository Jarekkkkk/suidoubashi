import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import * as styles from './index.styles'

interface Props {
  endDate: Date | null
  handleOnChange: (date: any) => void
}

const DatePickerComponent = (props: Props) => {
  const { endDate, handleOnChange } = props

  return (
    <DatePicker
      {...props}
      selected={endDate}
      onChange={(e) => handleOnChange(e?.toDateString())}
      className={styles.datePickerComponent}
      dateFormat='yyyy/MM/dd'
    />
  )
}

export default DatePickerComponent
