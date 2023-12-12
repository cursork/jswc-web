import { setStyle, excludeKeys } from '../utils';
import SelectComponent from './SelectComponent';

const Group = ({ data }) => {
  const styles = setStyle(data?.Properties);

  const { Visible } = data?.Properties;

  const updatedData = excludeKeys(data);

  return (
    <div
      style={{
        ...styles,
        border: '1px solid #E9E9E9',
        display: Visible == 0 ? 'none' : 'block',
      }}
      id={data?.ID}
    >
      {data?.Properties?.Caption && (
        <span
          style={{
            fontSize: '12px',
            position: 'relative',
            bottom: 14,
            left: 10,
            background: '#F1F1F1 ',
          }}
        >
          {data?.Properties?.Caption}
        </span>
      )}
      {Object.keys(updatedData).map((key) => (
        <SelectComponent data={updatedData[key]} />
      ))}
    </div>
  );
};

export default Group;
