
import * as styles from './index.styles';

interface Props {
  prevChildren?: any,
	children: any,
  title: string,
  titleImg: string,
}

const PageContainer = (props: Props) => {
  const { children, title, titleImg, prevChildren } = props;
  return (
    <div className={styles.pageContainer}>
      <div className={styles.titleSection}>
        <div className={styles.title}>
          {prevChildren && prevChildren}
          {title}
        </div>
        <img className={styles.titleImg} src={titleImg} />
      </div>
      {children}
    </div>
  );
};

export default PageContainer;
