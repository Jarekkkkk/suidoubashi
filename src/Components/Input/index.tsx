import { InputGroup } from '@blueprintjs/core'
import * as styles from './index.styles'

interface Props {
  value?: string 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  leftIcon?: any
  disabled?: boolean
}

const InputComponent = (props: Props) => {
  const { placeholder, leftIcon } = props

  return (
    <InputGroup
      {...props}
      onChange={props.onChange}
      placeholder={placeholder}
      leftIcon={leftIcon}
      className={styles.InputContent}
    />
  )
}

export default InputComponent
