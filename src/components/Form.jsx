import { setStyle, excludeKeys, rgbColor, getImageStyles } from '../utils';
import SelectComponent from './SelectComponent';
import { useAppData } from '../hooks';
import { useEffect, useState } from 'react';

const Form = ({ data }) => {
  function useForceRerender() {
    const [_state, setState] = useState(true);
    const reRender = () => {
      setState((prev) => !prev);
    };
    return { reRender };
  }

  const { reRender } = useForceRerender();

  const PORT = localStorage.getItem('PORT');
  const { findDesiredData } = useAppData();
  const [formStyles, setFormStyles] = useState({});

  const styles = setStyle(data?.Properties, 'relative');

  const { BCol, Picture, Size, Visible } = data?.Properties;
  const updatedData = excludeKeys(data);
  const ImageData = findDesiredData(Picture && Picture[0]);

  localStorage.setItem('formDimension', JSON.stringify(Size));

  let imageStyles = getImageStyles(Picture && Picture[1], PORT, ImageData);

  useEffect(() => {
    localStorage.setItem('current-focus', data.ID);
  }, []);

  useEffect(() => {
    setFormStyles(setStyle(data?.Properties, 'relative'));
  }, [data.Properties]);

  return (
    <div
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
