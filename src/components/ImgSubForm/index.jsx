import { setStyle } from '../../utils';
import { useAppData } from '../../hooks';

const ImageSubForm = ({ data }) => {
  const { findDesiredData } = useAppData();

  const styles = setStyle(data?.Properties);
  const { Size, Picture } = data?.Properties;

  let updatedStyles = { ...styles };

  const ImageData = findDesiredData(Picture && Picture[0]);

  // Image is Tile
  if (Picture && Picture[1] == 1) {
    updatedStyles = {
      ...styles,
      backgroundImage: `url(http://localhost:22322${ImageData?.Properties?.File})`,
      backgroundRepeat: 'repeat',
    };
  }

  // Align the Image in the top left Corner

  if (Picture && Picture[1] == 0) {
    updatedStyles = {
      ...styles,
      backgroundImage: `url(http://localhost:22322${ImageData?.Properties?.File})`,
      position: 'absolute',
      top: 0,
      left: 0,
    };
  }

  return <div style={updatedStyles}></div>;
};

export default ImageSubForm;
