import {
  PageContainer,
  InputSection,
  Input,
  Button,
  Loading,
  Empty,
} from '@/Components'
import { Link } from 'react-router-dom';
import { usePoolContext } from '@/Containers/Pool'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import * as styles from './index.styles'

const LiquidityPresentation = () => {
	return (
		<PageContainer
      title='Liquidity'
      titleImg={Image.pageBackground_1}
      prevChildren={
        <Link to='/pool' className={styles.prevButton}>
          <Icon.PrevIcon />
        </Link>
      }
    >
			<div>Liquidity</div>
		</PageContainer>
	)
};

export default LiquidityPresentation;