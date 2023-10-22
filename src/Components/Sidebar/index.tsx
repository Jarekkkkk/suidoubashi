import { useMemo } from 'react'
import { Icon as BlueIcon } from '@blueprintjs/core'
import { Link, useLocation } from 'react-router-dom'

import { generateSideBarLinks } from '@/Constants'

import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import SidebarButton from './_SidebarButton'
import * as styles from './index.styles'

interface Props {
  isSettingOpen: boolean
  setIsSettingOpen: Function
}

const SidebarComponent = (props: Props) => {
  const { isSettingOpen, setIsSettingOpen } = props
  let location = useLocation()
  const links = useMemo(() => generateSideBarLinks, [])

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.logoContent}>
        <Link to='/'>
          <Image.LogoText />
        </Link>
      </div>
      {links.map(
        (link) =>
          !link.isHidden && (
            <SidebarButton
              active={location.pathname.includes(link.path)}
              path={link.path}
              text={link.key}
              key={link.key}
              icon={link.icon}
            />
          ),
      )}
      <SidebarButton
        active={isSettingOpen}
        text='Setting'
        icon={<Icon.SettingIcon />}
        onClick={() => setIsSettingOpen(!isSettingOpen)}
      />
      <div className={styles.footerContent}>
        <div className={styles.footerIconBlock}>
          <Link
            to='https://suidoubashi-1.gitbook.io/suidoubashi/'
            target='_blank'
          >
            <BlueIcon icon='git-repo' />
          </Link>
          <Link to='https://twitter.com/suidoubashi_io' target='_blank'>
            <Icon.TwitterIcon />
          </Link>
          <Link to='https://t.me/suidoubashi' target='_blank'>
            <Icon.TelegramIcon />
          </Link>
        </div>
        <span>Testnet</span>
      </div>
    </div>
  )
}

export default SidebarComponent
