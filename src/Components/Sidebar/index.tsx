import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { generateSideBarLinks } from '@/Constants';

interface Props {
    isOpen: boolean
}
const SidebarComponent = (props: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const links = useMemo(() => generateSideBarLinks(), []);
    const { isOpen } = props;

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
