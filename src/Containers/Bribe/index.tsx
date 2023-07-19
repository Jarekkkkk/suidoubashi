import React, {
    useState,
    useEffect,
    useContext,
    PropsWithChildren,
} from 'react';
import { useParams } from 'react-router-dom';

const BribeContext = React.createContext<BribeContext>({
    data: null,
    fetching: false
});
export const useBribeContext = () => useContext(BribeContext);


const BribeContainer = ({ children }: PropsWithChildren) => {
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