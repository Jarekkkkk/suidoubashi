import {
  PageContainer,
  InputSection,
  Input,
  Button,
  Loading,
  Empty,
} from '@/Components'
import { usePoolContext } from '@/Containers/Pool'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import * as styles from './index.styles'

const PoolPresentation = () => {
	const {
		searchInput, setSearchInput, handleOnInputChange,
	} = usePoolContext();

	return (
		<PageContainer title='Pool' titleImg={Image.pageBackground_2}>
			<div className={styles.slognContent}>
				Provide Liquidity to SuiDoBashi ecosystem and earn weekly rewards
			</div>
			<div className={styles.poolpContainer}>
				<Input
					value={searchInput}
					onChange={handleOnInputChange}
					placeholder='SDB, SUI, 0x12...'
					leftIcon={<Icon.SearchIcon className={styles.searchInputIcon} />}
				/>
			</div>
		</PageContainer>
	)
};

export default PoolPresentation;