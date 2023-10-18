import * as Icons from './RibbonIcons';
import { RibbonButton } from 'react-bootstrap-ribbon';

const CustomRibbonButton = ({ data }) => {
  const { Icon, Caption } = data?.Properties;

  const IconComponent = Icons[Icon];

  return (
    <RibbonButton>
      <IconComponent size={20} />
      <div
        style={{
          display: 'flex',
          textWrap: 'balance',
          fontSize: '8px',
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {Caption}
      </div>
    </RibbonButton>
  );
};

export default CustomRibbonButton;
