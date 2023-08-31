import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import * as styles from './index.styles'

interface Props {
  endDate: Date | null
  handleOnChange: (date: any) => void
}

function addDays(theDate: Date, days: number) {
  return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000)
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
      minDate={new Date()}
      maxDate={addDays(new Date(), 24 * 7)}
    />
  )
}

export default DatePickerComponent
