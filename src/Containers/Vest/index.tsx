import React, {
    useState,
    useEffect,
    useContext,
    PropsWithChildren,
} from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

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