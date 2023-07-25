import { Sidebar } from '@/Components';
import * as styles from './index.styles';
interface Props {
	children: any,
}
const PageComponent = (props: Props) => {
	const { children } = props;

	return (
		<div className={styles.layoutContainer}>
			<Sidebar isOpen={true} />
			<div className={styles.mainContent}>
				{children}
			</div>
		</div>
	);
};
export default PageComponent;
