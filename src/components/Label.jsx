import { setStyle } from '../utils';
import '../styles/font.css';
import { useAppData } from '../hooks';

const Label = ({ data }) => {
  let styles = setStyle(data?.Properties);
  const { findDesiredData } = useAppData();
  const haveColor = data?.Properties.hasOwnProperty('FCol');
  const haveFontProperty = data?.Properties.hasOwnProperty('Font');

  const { Visible, FontObj } = data?.Properties;

  styles = { ...styles, fontSize: '11px' };

  if (haveColor) {
    styles = {
      ...styles,
      color: `rgb(${data?.Properties?.FCol[0]},${data?.Properties?.FCol[1]},${data?.Properties?.FCol[2]})`,
    };
  }

  if (haveFontProperty) {
    styles = {
      ...styles,
      fontFamily: data.Properties?.Font[0],
      fontSize: data?.Properties?.Font[1],
      width: '250px',
    };
  } else {
    const font = findDesiredData(FontObj && FontObj);
    const fontProperties = font && font?.Properties;
    styles = {
      ...styles,
      fontFamily: fontProperties?.PName,
      fontSize: !fontProperties?.Size ? '11px' : `${fontProperties?.Size}px`,
      textDecoration: !fontProperties?.Underline
        ? 'none'
        : fontProperties?.Underline == 1
        ? 'underline'
        : 'none',
      fontStyle: !fontProperties?.Italic ? 'none' : fontProperties?.Italic == 1 ? 'italic' : 'none',
      fontWeight: !fontProperties?.Weight ? 0 : fontProperties?.Weight,
    };
  }

  return (
    <div style={{ ...styles, display: Visible == 0 ? 'none' : 'block' }}>
      {data?.Properties?.Caption}
    </div>
  );
};

export default Label;
