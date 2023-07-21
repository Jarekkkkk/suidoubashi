import { useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface Props {
    title: string
}
const PageComponent = (props: Props) => {
    useEffect(() => {
        let _title = '';

        if (props.title) {
            _title += `${props.title} | `;
        }

        _title += 'Workbench | OEC Group';

        document.title = _title;
    }, [props.title]);

    return (
        <Route {...props as RouteProps} />
    );
};
export default PageComponent;
