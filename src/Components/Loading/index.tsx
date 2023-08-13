import cx from 'classnames';
import { Spinner } from '@blueprintjs/core';

import * as styles from './index.styles'

type Props = {
  className?: string,
};

const LoadingComponent = (props: Props) => (
  <div
    className={cx('loading-animation', styles.wrap, props.className)}
    data-testid="loading"
  >
    <Spinner {...props} />
  </div>
);

export default LoadingComponent;
