const Ecllipse = ({
  width = 300,
  height = 400,
  fillColors = ['#FF0000', '#00FF00', '#FFFF00', '#0000FF'],
  startAngles = [0, 43, 140, 216],
}) => {
  return (
    <svg width='300' height='200' xmlns='http://www.w3.org/2000/svg'>
      <ellipse cx='150' cy='100' rx='120' ry='50' fill='none' stroke='black' stroke-width='2' />

      <path d='M150,100 L150,50 A120,50 0 0,1 270,80 Z' fill='#ff5733' />

      <path d='M150,100 L270,80 A120,50 0 0,1 270,120 Z' fill='#33aaff' />

      <path d='M150,100 L270,120 A120,50 0 0,1 150,150 Z' fill='#33ff33' />

      <path d='M150,100 L150,150 A120,50 0 0,1 30,120 Z' fill='#ffcc33' />
    </svg>
  );
};
export default Ecllipse;
