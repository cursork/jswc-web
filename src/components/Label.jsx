import { setStyle } from '../utils';
import '../styles/font.css';

const Label = ({ data }) => {
  let styles = setStyle(data?.Properties);
  const haveColor = data?.Properties.hasOwnProperty('FCol');
  const haveFontProperty = data?.Properties.hasOwnProperty('Font');

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
  }

  return <div style={{ ...styles }}>{data?.Properties?.Caption}</div>;
};

export default Label;
