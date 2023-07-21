import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { generateSideBarLinks } from '@/Constants';

interface Props {
    isOpen: boolean
}
const SidebarComponent = (props: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const links = useMemo(() => generateSideBarLinks(), []);
    const { isOpen } = props;
    console.log(isOpen)
    return (
        <div>
            {
                links.map((link) => (
                    <li key={link.key}>
                        <Link to={link.path}>{link.key}</Link>
                    </li>
                ))
            }
        </div>
    );
};

export default SidebarComponent;
