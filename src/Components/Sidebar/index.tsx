import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { generateSideBarLinks } from '@/Constants';

import * as styles from './index.styles';

interface Props {
    isOpen: boolean
}

const SidebarComponent = (props: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const links = useMemo(() => generateSideBarLinks(), []);
	const { isOpen } = props;
	console.log(isOpen)
	return (
		<div className={styles.sidebarContainer}>
			{
				links.map((link) => (
					<div className={styles.sidebarItem} key={link.key}>
							<Link to={link.path}>{link.key}</Link>
					</div>
				))
			}
		</div>
	);
};

export default SidebarComponent;
