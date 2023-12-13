import { setStyle, excludeKeys, rgbColor } from '../utils';
import SelectComponent from './SelectComponent';
import { useAppData } from '../hooks';

const Form = ({ data }) => {
  const { findDesiredData } = useAppData();
  const styles = setStyle(data?.Properties, 'relative');

  const { BCol, Picture, Size, Visible } = data?.Properties;

  // const decideImageStyle = Picture && Picture[1];

  const updatedData = excludeKeys(data);

  // const ImageData = findDesiredData(Picture && Picture[0]);

  localStorage.setItem('formDimension', JSON.stringify(Size));

  // let imageStyles = null;

  // if (decideImageStyle == 1) {
  //   imageStyles = {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //   };
  // }

  return (
    <div
      style={{
        ...styles,
        // width: '1000px',
        background: BCol ? rgbColor(BCol) : '#F0F0F0',
        position: 'relative',
        border: '1px solid #F0F0F0',
        display: Visible == 0 ? 'none' : 'block',
      }}
    >
      {/* {ImageData ? (
        <img style={imageStyles} src={`http://localhost:22322/${ImageData?.Properties?.File}`} />
      ) : null} */}
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default Form;
