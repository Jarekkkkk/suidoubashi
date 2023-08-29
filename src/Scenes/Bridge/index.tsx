import * as styles from './index.styles'

//@ts-ignore
import WormholeBridge from '@wormhole-foundation/wormhole-connect'

const BridgeScene = () => {
  return (
    <div className={styles.wormholeBridgeContainer}>
      <WormholeBridge />
    </div>
  )
}

export default BridgeScene
