import React, {
    useState,
    useEffect,
    useContext,
    PropsWithChildren,
} from 'react';
import { useParams } from 'react-router-dom';

const VoteContext = React.createContext<VoteContext>({
    data: null,
    fetching: false
});
export const useVoteContext = () => useContext(VoteContext);

const VoteContainer = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const handleFetchData = () => {
        return
    };

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