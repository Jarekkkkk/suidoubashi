import React, {
    useState,
    useEffect,
    useContext,
    PropsWithChildren,
} from 'react';
import { useParams } from 'react-router-dom';

const SwapContext = React.createContext<SwapContext>({
    data: null,
    fetching: false
});
export const useSwapContext = () => useContext(SwapContext);

const SwapContainer = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const handleFetchData = () => {
        return
    };

    return (
        <SwapContext.Provider
            value={{
                data,
                fetching,
            }}
        >
            {children}
        </SwapContext.Provider>
    );
};

interface SwapContext {
    readonly data: [] | null,
    readonly fetching: boolean,
}

export default SwapContainer;