import React, {
    useState,
    useContext,
    PropsWithChildren,
} from 'react';

const VestContext = React.createContext<VestContext>({
    data: null,
    fetching: false
});
const useVestContext = () => useContext(VestContext);

const VestContainer = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const handleFetchData = () => {
        return
    };

    return (
        <VestContext.Provider
            value={{
                data,
                fetching,
            }}
        >
            {children}
        </VestContext.Provider>
    );
};

interface VestContext {
    readonly data: [] | null,
    readonly fetching: boolean,
}

export default VestContainer;