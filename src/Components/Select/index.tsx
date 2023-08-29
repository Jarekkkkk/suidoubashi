import Select from 'react-select'

export interface SelectOption {
  label: string
  value: any
}
type Props = {
  options: Array<SelectOption>
  onChange: (v: any) => void
  value?: SelectOption | null
  defaultValue?: SelectOption
}

const SelectCompoonent = (props: Props) => {
  const { options, onChange } = props

  const customStyles = {
    container: (styles: any) => ({
      ...styles,
      width: '100%',
    }),
    option: (styles: any) => ({
      ...styles,
      borderColor: '#2977EC',
    }),
  }

  return (
    <Select
      {...props}
      defaultValue={props.defaultValue}
      onChange={onChange}
      styles={customStyles}
      options={options}
    />
  )
}

export default SelectCompoonent
