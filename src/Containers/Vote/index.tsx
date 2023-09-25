import React, {
	useState,
	useContext,
	useCallback,
	PropsWithChildren,
	ChangeEvent,
} from 'react';
import { regexEn } from '@/Constants/index'

const VoteContext = React.createContext<VoteContext>({
	data: null,
	fetching: false,
  searchInput: '',
  handleOnInputChange: () => {},
});
export const useVoteContext = () => useContext(VoteContext);

const VoteContainer = ({ children }: PropsWithChildren) => {
	const [data, _setData] = useState(null);
	const [fetching, _setFetching] = useState(false);
	const [searchInput, setSearchInput] = useState('');


  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value

      const isValid = regexEn.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setSearchInput(value.toUpperCase())
    },
    [setSearchInput],
  )


	return (
		<VoteContext.Provider
			value={{
				data,
				fetching,
				searchInput,
				handleOnInputChange,
			}}
		>
			{children}
		</VoteContext.Provider>
	);
};

interface VoteContext {
	readonly data: [] | null,
	readonly fetching: boolean,
  searchInput: string,
  handleOnInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
}
export default VoteContainer;