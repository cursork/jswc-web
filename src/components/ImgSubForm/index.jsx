import { setStyle } from '../../utils';
import { useAppData } from '../../hooks';

const ImageSubForm = ({ data }) => {
  const PORT = localStorage.getItem('PORT');

  const { findDesiredData } = useAppData();

  const styles = setStyle(data?.Properties);
  const { Size, Picture } = data?.Properties;

  let updatedStyles = { ...styles };

  const ImageData = findDesiredData(Picture && Picture[0]);

  // Image is Tile
  if (Picture && Picture[1] == 1) {
    updatedStyles = {
      ...styles,
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      backgroundRepeat: 'repeat',
    };
  }

  // Align the Image in the top left Corner

  if (Picture && Picture[1] == 0) {
    updatedStyles = {
      ...styles,
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      position: 'absolute',
      top: 0,
      left: 0,
    };
  }

  // Make the image center in the subform

  if (Picture && Picture[1] == 3) {
    updatedStyles = {
      ...styles,
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      backgroundPosition:
        'center center' /* Center the background image horizontally and vertically */,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  // Image is Scalar means Image fit exactly horizontally and vertically

  if (Picture && Picture[1] == 2) {
    updatedStyles = {
      ...styles,
      backgroundImage: `url(http://localhost:${PORT}${ImageData?.Properties?.File})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  return <div style={updatedStyles}></div>;
};

export default ImageSubForm;
