import { setStyle } from '../utils';

const Label = ({ data }) => {
  let styles = setStyle(data?.Properties);
  const haveColor = data?.Properties.hasOwnProperty('FCol');

  if (haveColor) {
    styles = {
      ...styles,
      color: `rgb(${data?.Properties?.FCol[0]},${data?.Properties?.FCol[1]},${data?.Properties?.FCol[2]})`,
    };
  }

  return <div style={{ ...styles, fontSize: '11px' }}>{data?.Properties?.Caption}</div>;
};

export default Label;
