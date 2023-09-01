import { RadioGroup } from '@blueprintjs/core'

import * as styles from './index.styles'

interface Props {
  selectedValue: string | number
  onChange: (e: any) => void
  options: Array<{
    label: string
    value: string
  }>
  disabled?: boolean
}

const RadioGroupComponent = (props: Props) => {
  const { onChange, options } = props
  return (
    <RadioGroup
      {...props}
      className={styles.radioGroupComponent}
      onChange={(e) => onChange(e.currentTarget.value)}
      options={options}
    />
  )
}
export default RadioGroupComponent
