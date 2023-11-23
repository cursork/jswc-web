import * as Icons from './RibbonIcons';
import { RibbonButton } from 'react-bootstrap-ribbon';

const CustomRibbonButton = ({ data }) => {
  const { Icon, Caption } = data?.Properties;

  const IconComponent = Icons[Icon];
  return (
    <div className='d-flex align-items-center justify-content-center'>
      <div className='d-flex align-items-center flex-column justify-content-center'>
        <IconComponent size={30} />
        <div style={{ fontSize: '11px', fontWeight: 'bolder',textAlign:"center" }}>{Caption}</div>
      </div>
    </div>
  );
};

export default CustomRibbonButton;
