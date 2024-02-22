import { setStyle, excludeKeys, rgbColor, getImageStyles } from '../utils';
import SelectComponent from './SelectComponent';
import { useAppData, useWindowDimensions } from '../hooks';
import { useEffect, useState } from 'react';

const Form = ({ data }) => {
  const { viewport } = useWindowDimensions();

  const PORT = localStorage.getItem('PORT');
  const { findDesiredData } = useAppData();
  const [formStyles, setFormStyles] = useState({});

  const styles = setStyle(data?.Properties, 'relative');

  const { BCol, Picture, Size, Visible, Posn, Flex = 0 } = data?.Properties;
  const updatedData = excludeKeys(data);
  const ImageData = findDesiredData(Picture && Picture[0]);

  localStorage.setItem('formDimension', JSON.stringify(Size));

  let imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  useEffect(() => {
    localStorage.setItem('current-focus', data.ID);
    localStorage.setItem(
      data?.ID,
      JSON.stringify({
        Size,
        Posn,
      })
    );
  }, [data]);

  useEffect(() => {
    setFormStyles(setStyle(data?.Properties, 'relative', Flex));
  }, [data.Properties]);

  return (
    <div
      id={data?.ID}
      style={{
        ...formStyles,
        // width: '1000px',
        background: BCol ? rgbColor(BCol) : '#F0F0F0',
        position: 'relative',
        border: '1px solid #F0F0F0',
        display: Visible == 0 ? 'none' : 'block',
        ...imageStyles,
        overflow: 'hidden',
      }}
    >
      {Object.keys(updatedData).map((key) => {
        return <SelectComponent data={updatedData[key]} />;
      })}
    </div>
  );
};

export default Form;
