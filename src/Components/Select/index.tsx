import Select from 'react-select'

type Props = {
  options: Array<{
    label: string,
    value: string,
  }>,
}

const SelectCompoonent = (props: Props) => {
  const { options } = props;

  const customStyles = {
    container: (styles: any) => ({
      ...styles,
      width: '100%',
    }),
    option: (styles: any) => ({
      ...styles,
      borderColor: '#2977EC',
    }),
  };

  return (
    <Select
      {...props}
      styles={customStyles}
      options={options}
    />
  );
};

export default SelectCompoonent;