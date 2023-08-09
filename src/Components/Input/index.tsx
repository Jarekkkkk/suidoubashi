import { useState } from 'react';
import { InputGroup } from "@blueprintjs/core";
import * as styles from './index.styles';

interface Props {
  placeholder: string,
  leftIcon?: any,
  disabled?: boolean,
}

const InputComponent = (props: Props) => {
  const { placeholder, leftIcon } = props;

  return (
    <InputGroup
      {...props}
      placeholder={placeholder}
      leftIcon={leftIcon}
      className={styles.InputContent}
    />
  );
};

export default InputComponent;