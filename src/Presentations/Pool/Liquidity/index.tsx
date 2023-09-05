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

const LiquidityPresentation = () => {
	return (
		<PageContainer title='Liquidity' titleImg={Image.pageBackground_1}>
			<div>Liquidity</div>
		</PageContainer>
	)
};

export default LiquidityPresentation;