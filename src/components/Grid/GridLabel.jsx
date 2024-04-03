import { useRef, useEffect } from 'react';

const GridLabel = ({ data }) => {
  const labelRef = useRef();

  useEffect(() => {
    if (data.focused) {
      labelRef?.current?.focus();
    }
  }, [data.focused]);

  const fontProperties = data?.cellFont && data?.cellFont?.Properties;

  let fontStyles = {
    fontFamily: fontProperties?.PName,
    fontSize: !fontProperties?.Size ? '11px' : '12px',
    textDecoration: !fontProperties?.Underline
      ? 'none'
      : fontProperties?.Underline == 1
      ? 'underline'
      : 'none',
    fontStyle: !fontProperties?.Italic ? 'none' : fontProperties?.Italic == 1 ? 'italic' : 'none',
    fontWeight: !fontProperties?.Weight ? 0 : fontProperties?.Weight,
  };

  return (
    <div
      tabIndex={'100'}
      style={{ backgroundColor: data?.backgroundColor, outline: 0, ...fontStyles }}
      ref={labelRef}
    >
      {data?.value}
    </div>
  );
};

export default GridLabel;
