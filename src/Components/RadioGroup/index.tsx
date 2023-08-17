import { RadioGroup } from '@blueprintjs/core';

import * as styles from './index.styles';

interface Props {
  selectedValue?: string,
  onChange: (e: any) => void,
  options: Array<{
    label: string,
    value: string,
  }>,
}

const RadioGroupComponent = (props: Props) => {
  const { onChange, options } = props;

  return (
    <RadioGroup
      {...props}
      className={styles.radioGroupComponent}
      onChange={onChange}
      options={options}
    />
  );
};

export default RadioGroupComponent;
