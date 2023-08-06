import { useMemo } from 'react';

import { generateSideBarLinks } from '@/Constants';

import Image from '@/Assets/image';
import SidebarButton from './_SidebarButton';
import * as styles from './index.styles';

interface Props {
    isOpen: boolean
}

const SidebarComponent = (props: Props) => {
	const links = useMemo(() => generateSideBarLinks(), []);
	const { isOpen } = props;

	return (
		<div className={styles.sidebarContainer}>
			<img src={Image.logo} className={styles.logoItem} />
			{
				links.map((link) => (
					<SidebarButton path={link.path} text={link.key} key={link.key} icon={link.icon} />
				))
			}
		</div>
	);
};

export default SidebarComponent;
