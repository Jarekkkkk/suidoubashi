import React, {
    useState,
    useContext,
    PropsWithChildren,
} from 'react';

export const DashboardContext = React.createContext<DashboardContext>({
    data: null,
    fetching: false
});

export const useDashboardContext = () => useContext(DashboardContext);

export const DashboardContainer = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const handleFetchData = () => {
        return
    };

    return (
        <DashboardContext.Provider
            value={{
                data,
                fetching,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};


interface DashboardContext {
    readonly data: [] | null,
    readonly fetching: boolean,
}

export default DashboardContainer;