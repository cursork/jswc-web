import { setStyle, excludeKeys, rgbColor, getImageStyles } from '../utils';
import SelectComponent from './SelectComponent';
import { useAppData, useWindowDimensions } from '../hooks';
import { useEffect, useState } from 'react';

const Form = ({ data }) => {
  const { viewport } = useWindowDimensions();

  const PORT = localStorage.getItem('PORT');
  const { findDesiredData, handleData, reRender } = useAppData();
  const [formStyles, setFormStyles] = useState({});

  const styles = setStyle(data?.Properties, 'relative');

  const { BCol, Picture, Size, Visible, Posn, Flex = 0 } = data?.Properties;
  const updatedData = excludeKeys(data);
  const ImageData = findDesiredData(Picture && Picture[0]);

  let imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  // Set the current Focus
  useEffect(() => {
    localStorage.setItem('current-focus', data.ID);
  }, []);

  // useEffect to check the size is present otherwise Viewport half height and width

  useEffect(() => {
    const hasSize = data?.Properties?.hasOwnProperty('Size');

    const halfViewportWidth = Math.round(window.innerWidth / 2);

    const halfViewportHeight = Math.round(window.innerHeight / 2);

    localStorage.setItem(
      'formDimension',
      JSON.stringify(hasSize ? Size : [halfViewportHeight, halfViewportWidth])
    );

    localStorage.setItem(
      data?.ID,
      JSON.stringify({
        Size: hasSize ? Size : [halfViewportHeight, halfViewportWidth],
        Posn,
      })
    );

    setFormStyles(
      setStyle(
        {
          ...data?.Properties,
          ...(hasSize ? { Size } : { Size: [halfViewportHeight, halfViewportWidth] }),
        },
        'relative',
        Flex
      )
    );
  }, [data]);

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
