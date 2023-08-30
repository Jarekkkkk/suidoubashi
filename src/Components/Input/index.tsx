import { InputGroup } from '@blueprintjs/core'
import * as styles from './index.styles'

interface Props {
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  leftIcon?: any
  disabled?: boolean
  type?: string
}

const InputComponent = (props: Props) => {
  const { type, placeholder, leftIcon } = props

  return (
    <InputGroup
      {...props}
      type={type}
      placeholder={placeholder}
      leftIcon={leftIcon}
      className={styles.InputContent}
    />
  )
}

export default InputComponent
