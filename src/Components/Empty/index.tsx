import { Icon } from '@/Assets/icon'
import * as styles from './index.styles'

const EmptyComponent = ({content}:{content: string}) => {
  return (
    <div className={styles.emptyContainer}>
      <Icon.LogoIcon />
      <span>{content}</span>
    </div>
  )
}

export default EmptyComponent
