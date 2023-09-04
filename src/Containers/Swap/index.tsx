import React, {
	useState,
	useContext,
	PropsWithChildren,
	useCallback,
} from 'react';
import UserModule from '@/Modules/User';
import { CoinIcon } from '@/Assets/icon'
import { Coins, Coin, CoinInterface } from '@/Constants/coin';
import { useGetAllBalance, Balance } from '@/Hooks/Coin/useGetBalance';

const SwapContext = React.createContext<SwapContext>({
	coinData: undefined,
	isCoinDataLoading: false,
	coinInputFirst: '',
	coinTypeFirst: {
		type: Coin.SUI,
		logo: <CoinIcon.SUIIcon />,
		name: 'SUI',
		decimals: 9,
	},
	coinInputSecond: '',
	coinTypeSecond: {
		type: Coin.SDB,
		logo: <CoinIcon.SDBIcon />,
		name: 'SDB',
		decimals: 9,
	},
	handleOnCoinInputFirstChange: () => {},
	handleOnCoinInputSecondChange: () => {},
	isShowSelectModal: false,
	setIsShowSelectModal: () => {},
	setCoinTypeFirst: () => {},
	setCoinTypeSecond: () => {},
});
export const useSwapContext = () => useContext(SwapContext);

const SwapContainer = ({ children }: PropsWithChildren) => {
	const [coinInputFirst, setCoinInputFirst] = useState<string>('');
	const [coinTypeFirst, setCoinTypeFirst] = useState<CoinInterface>(Coins.filter((coin) => coin.name === 'SUI')[0]);
	const [coinInputSecond, setCoinInputSecond] = useState<string>('');
	const [coinTypeSecond, setCoinTypeSecond] = useState<CoinInterface>(Coins.filter((coin) => coin.name === 'SDB')[0]);
	const [isShowSelectModal, setIsShowSelectModal]= useState<boolean>(false)

  const walletAddress = UserModule.getUserToken()
  const { data: coinData, isLoading: isCoinDataLoading } = useGetAllBalance(
    Coins,
    walletAddress,
  )

	const handleOnCoinInputFirstChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputFirst(value)
    },
    [setCoinInputFirst],
  )

	const handleOnCoinInputSecondChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputSecond(value)
    },
    [setCoinInputSecond],
  )

	return (
		<SwapContext.Provider
			value={{
				coinData,
				isCoinDataLoading,
				coinInputFirst,
				coinTypeFirst,
				coinInputSecond,
				coinTypeSecond,
				handleOnCoinInputFirstChange,
				handleOnCoinInputSecondChange,
				isShowSelectModal,
				setIsShowSelectModal,
				setCoinTypeFirst,
				setCoinTypeSecond,
			}}
		>
			{children}
		</SwapContext.Provider>
	);
};

interface SwapContext {
	readonly coinData: Balance[] | undefined,
	readonly isCoinDataLoading: boolean,
	coinInputFirst: string,
	coinTypeFirst: CoinInterface | undefined,
	coinInputSecond: string,
	coinTypeSecond: CoinInterface | undefined,
	handleOnCoinInputFirstChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	handleOnCoinInputSecondChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isShowSelectModal: boolean,
	setIsShowSelectModal: Function,
	setCoinTypeFirst: Function,
	setCoinTypeSecond: Function,
}

export default SwapContainer;