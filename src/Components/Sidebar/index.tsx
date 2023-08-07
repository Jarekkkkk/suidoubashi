import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { generateSideBarLinks } from '@/Constants';

import Image from '@/Assets/image';
import SidebarButton from './_SidebarButton';
import * as styles from './index.styles';

interface Props {
    isOpen: boolean
}

const SidebarComponent = (props: Props) => {
	let location = useLocation();
	const links = useMemo(() => generateSideBarLinks(), []);
	const { isOpen } = props;

	return (
		<div className={styles.sidebarContainer}>
			<div className={styles.logoContent}>
				<Link to="/" >
					<Image.LogoText/>
				</Link>
			</div>
			{
				links.map((link) => (
					<SidebarButton active={location.pathname.includes(link.path)} path={link.path} text={link.key} key={link.key} icon={link.icon} />
				))
			}
		</div>
	);
};

export default SidebarComponent;
