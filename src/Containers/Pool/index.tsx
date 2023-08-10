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

    const departPool = () => {
        try {
            const res = get_pool_reg();

        } catch (error) {

        }

    };

    useEffect(() => {
        departPool();
    }, []);
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