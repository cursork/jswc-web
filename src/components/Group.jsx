import { setStyle, excludeKeys } from '../utils';
import SelectComponent from './SelectComponent';

const Group = ({ data }) => {
  const styles = setStyle(data?.Properties);

  const updatedData = excludeKeys(data);

  return (
    <div style={{ ...styles, border: '1px solid #F0F0F0', background: 'white' }}>
      {data?.Properties?.Caption && <p style={{ fontSize: '12px' }}>{data?.Properties?.Caption}</p>}
      {Object.keys(updatedData).map((key) => (
        <SelectComponent data={updatedData[key]} />
      ))}
    </div>
  );
};

export default Group;
