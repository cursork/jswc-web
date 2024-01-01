import { setStyle, excludeKeys, getImageStyles } from '../utils';
import SelectComponent from './SelectComponent';
import { useAppData } from '../hooks';

const Group = ({ data }) => {
  const PORT = localStorage.getItem('PORT');
  const styles = setStyle(data?.Properties);
  const { Visible, Picture } = data?.Properties;
  const { findDesiredData } = useAppData();

  const ImageData = findDesiredData(Picture && Picture[0]);

  const imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  const updatedData = excludeKeys(data);

  return (
    <div
      style={{
        ...styles,
        border: '1px solid #E9E9E9',
        display: Visible == 0 ? 'none' : 'block',
        ...imageStyles,
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
