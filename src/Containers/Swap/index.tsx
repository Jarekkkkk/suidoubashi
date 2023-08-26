import React, {
    useState,
    useContext,
    PropsWithChildren,
} from 'react';

const SwapContext = React.createContext<SwapContext>({
    data: null,
    fetching: false
});
export const useSwapContext = () => useContext(SwapContext);

const SwapContainer = ({ children }: PropsWithChildren) => {
    const [data, _setData] = useState(null);
    const [fetching, _setFetching] = useState(false);


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