import cx from 'classnames';
import { Dialog } from '@blueprintjs/core';

import { Icon } from '@/Assets/icon';
import * as styles from './index.styles';

type Props = {
  title: string,
  titleImg: string,
  className?: string,
  bodyClassname?: string,
  children: any,
  isShow: boolean,
  setIsShow: Function,
}

const DialogComponent = (props: Props) => {
  const {
    title,
    titleImg,
    children,
    className,
    isShow,
    setIsShow,
    ...nextProps
  } = props;

  return (
    <Dialog
      {...nextProps}
      isOpen={isShow}
      className={cx(styles.dialogComponent, className)}
    >
      <div className={styles.titleSection}>
        <div className={styles.title}>{title}</div>
        <img className={styles.titleImg} src={titleImg} />
        <Icon.CrossIcon className={styles.closeButton} onClick={() => setIsShow(false)} />
      </div>
      <div className={cx(styles.body, props.bodyClassname)}>
        {children}
      </div>
    </Dialog>
  );
};

export default DialogComponent;
