import { useParams } from 'react-router-dom';

import PoolContainer from '@/Containers/Pool'
import LiquidityContainer from '@/Containers/Pool/Liquidity'
import PoolPresentation from '@/Presentations/Pool'
import LiquidityPresentation from '@/Presentations/Pool/Liquidity'

const PoolScene = () => {
  const { action } = useParams();

  switch (action) {
    case 'Liquidity':
      return (
        <LiquidityContainer>
          <LiquidityPresentation />
        </LiquidityContainer>
      )

    default:
      return (
        <PoolContainer>
          <PoolPresentation />
        </PoolContainer>
      )
  }
}

export default PoolScene;
