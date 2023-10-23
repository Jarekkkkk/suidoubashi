import { Position, Tooltip } from '@blueprintjs/core'
import { Icon } from '@/Assets/icon'

import * as styles from './index.styles'

const TooltipComponent = (props: { content: any; }) => {
  const { content } = props;

  return (
    <Tooltip
      intent="primary"
      content={content}
      position={Position.TOP}
      popoverClassName={styles.tooltipContent}
    >
      <Icon.NoticeIcon className={styles.icon} />
    </Tooltip>
  )
}

export default TooltipComponent;
