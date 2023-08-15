import { ProgressBar } from '@blueprintjs/core'

import '@blueprintjs/core/lib/css/blueprint.css'

import { Icon } from '@/Assets/icon'
import { cx } from '@emotion/css'
import { required_exp } from '@/Utils/game'
import Image from '@/Assets/image'
import * as styles from './index.styles'

interface Props {
  nftImg: any
  level: string
  expValue: number
  sdbValue: number
  vesdbValue: number
  address: string
  handleFetchNFTData: (e: any) => void
  isPrevBtnDisplay: boolean,
  isNextBtnDisplay: boolean,
}

const NFTCardComponent = (props: Props) => {
  const {
    level,
    address,
    nftImg,
    expValue,
    sdbValue,
    vesdbValue,
    handleFetchNFTData,
    isPrevBtnDisplay,
    isNextBtnDisplay,
  } = props

  const handleOnCopy = (value: string) => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardContent}>
        {isPrevBtnDisplay && <div className={styles.cardPrev} onClick={() => handleFetchNFTData('prev')} />}
        <img src={nftImg || Image.nftDefault} />
        {isNextBtnDisplay && <div className={styles.cardNext} onClick={() => handleFetchNFTData('next')} />}
      </div>
      <div className={styles.cardInfo}>
        <div className={cx(styles.infoContent, styles.levelContent)}>
          <div className={styles.valueText}>Level</div>
          <span>{level}</span>
        </div>
        <div className={styles.infoContent}>
          <div className={styles.valueText}>EXP</div>
          <ProgressBar
            value={expValue / required_exp(parseInt(level) + 1)}
            animate={false}
            stripes={false}
            intent='primary'
          />
        </div>
        <div className={styles.infoContent}>
          <div className={styles.valueText}>VeSDB</div>
          <ProgressBar
            value={vesdbValue/ sdbValue}
            animate={false}
            stripes={false}
            intent='primary'
          />
        </div>
        <div className={styles.addressContent}>
          <span>{address}</span>
          <div
            className={styles.copyIcon}
            onClick={() => handleOnCopy(address)}
          >
            <Icon.CopyIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTCardComponent
