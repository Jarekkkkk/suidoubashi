import React, {
    useState,
    useContext,
    PropsWithChildren,
} from 'react';

export const BribeContext = React.createContext<BribeContext>({
    data: null,
    fetching: false
});

export const useBribeContext = () => useContext(BribeContext);

export const BribeContainer = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const handleFetchData = () => {
        return
    };

    return (
        <BribeContext.Provider
            value={{
                data,
                fetching,
            }}
        >
            {children}
        </BribeContext.Provider>
    );
};


interface BribeContext {
    readonly data: [] | null,
    readonly fetching: boolean,
}

export default BribeContainer;