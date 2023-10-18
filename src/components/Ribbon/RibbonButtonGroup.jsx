import * as AppIcons from './RibbonIcons';

const CustomRibbonButtonGroup = ({ data }) => {
  const { Captions, Icons } = data?.Properties;

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
            <IconComponent size={12} />
            <div style={{ fontSize: '8px', margin: '10px', textAlign: 'center' }}>{title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomRibbonButtonGroup;
