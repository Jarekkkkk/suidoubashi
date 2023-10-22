import { cx } from '@emotion/css'
import * as styles from './index.styles'


interface Props {
    width: string
}
const Skeleton = ({ width }: Props) => {
    return <div className={cx(
        styles.skeleton, styles.animate_pulse, styles.skeleton_text, {
        [styles.skeleton_width_50]: width === '50',
        [styles.skeleton_width]: width === '100',
    },
    )}></div>
}
export default Skeleton