import React, {
    useState,
    useContext,
    PropsWithChildren,
} from 'react';

const RewardsContext = React.createContext<RewardsContext>({
    data: null,
    fetching: false
});
export const useRewardsContext = () => useContext(RewardsContext);

const RewardsContainer = ({ children }: PropsWithChildren) => {
    const [data, _setData] = useState(null);
    const [fetching, _setFetching] = useState(false);

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