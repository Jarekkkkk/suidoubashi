import * as styles from './index.styles'

//@ts-ignore
import WormholeBridge from '@wormhole-foundation/wormhole-connect'

const DashboardScene = () => {
  return (
    <div className={styles.wormholeBridgeContainer}>
      <WormholeBridge />
    </div>
  )
}

export default DashboardScene
