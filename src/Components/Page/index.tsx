import { Sidebar } from '@/Components';
import * as styles from './index.styles';
interface Props {
	children: any,
}
const PageComponent = (props: Props) => {
	const { children } = props;

	return (
		<div className={styles.layoutContainer}>
			<div className={styles.mainContent}>
				<Sidebar isOpen={true} />
				<div className={styles.content}>
					{children}
				</div>
			</div>
		</div>
	);
};
export default PageComponent;
