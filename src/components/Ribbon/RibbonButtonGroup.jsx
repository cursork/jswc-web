import * as AppIcons from './RibbonIcons';

const CustomRibbonButtonGroup = ({ data }) => {
  const { Captions, Icons } = data?.Properties;

  return null;
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}
    >
      {Captions.map((title, i) => {
        let IconComponent = AppIcons[Icons[i]];
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <IconComponent size={20} />
            <div style={{ fontSize: '12px', margin: '10px', textAlign: 'center' }}>{title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomRibbonButtonGroup;
