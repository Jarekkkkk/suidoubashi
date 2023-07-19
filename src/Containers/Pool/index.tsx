import React, {
    useState,
    useEffect,
    useContext,
    PropsWithChildren,
} from 'react';
import { useParams } from 'react-router-dom';

const PoolContext = React.createContext<PoolContext>({
    data: null,
    fetching: false
});
export const usePoolContext = () => useContext(PoolContext);

const PoolContainer = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(false);

    const handleFetchData = () => {
        return
    };

    return (
        <PoolContext.Provider
            value={{
                data,
                fetching,
            }}
        >
            {children}
        </PoolContext.Provider>
    );
};

interface PoolContext {
    readonly data: [] | null,
    readonly fetching: boolean,
}


export default PoolContainer;