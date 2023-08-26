import React, {
    useState,
    useContext,
    PropsWithChildren,
} from 'react';

const VoteContext = React.createContext<VoteContext>({
    data: null,
    fetching: false
});
export const useVoteContext = () => useContext(VoteContext);

const VoteContainer = ({ children }: PropsWithChildren) => {
    const [data, _setData] = useState(null);
    const [fetching, _setFetching] = useState(false);

    return (
        <VoteContext.Provider
            value={{
                data,
                fetching,
            }}
        >
            {children}
        </VoteContext.Provider>
    );
};

interface VoteContext {
    readonly data: [] | null,
    readonly fetching: boolean,
}
export default VoteContainer;