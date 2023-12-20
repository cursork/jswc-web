import { setStyle, getImageStyles } from '../../utils';
import { useAppData } from '../../hooks';

const ImageSubForm = ({ data }) => {
  const PORT = localStorage.getItem('PORT');

  const { findDesiredData } = useAppData();

  const styles = setStyle(data?.Properties);
  const { Size, Picture } = data?.Properties;

  const ImageData = findDesiredData(Picture && Picture[0]);

  const imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  let updatedStyles = { ...styles, ...imageStyles };

  return <div style={updatedStyles}></div>;
};

export default ImageSubForm;
