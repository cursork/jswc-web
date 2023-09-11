import { setStyle, excludeKeys } from '../utils';
import SelectComponent from './SelectComponent';

const Form = ({ data }) => {
  const styles = setStyle(data?.Properties, 'relative');

  const updatedData = excludeKeys(data);

  return (
    <div
      style={{
        ...styles,
        background: '#F0F0F0',
        position: 'relative',
        border: '1px solid #F0F0F0',
      }}
    >
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default Form;
