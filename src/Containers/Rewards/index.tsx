import React, {
    useState,
    useEffect,
    useContext,
    PropsWithChildren,
} from 'react';
import { useParams } from 'react-router-dom';

const RewardsContext = React.createContext<RewardsContext>({
    data: null,
    fetching: false
});
export const useRewardsContext = () => useContext(RewardsContext);

const RewardsContainer = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const handleFetchData = () => {
        return
    };

    return (
        <RewardsContext.Provider
            value={{
                data,
                fetching,
            }}
        >
            {children}
        </RewardsContext.Provider>
    );
};

interface RewardsContext {
    readonly data: [] | null,
    readonly fetching: boolean,

}

export default RewardsContainer;