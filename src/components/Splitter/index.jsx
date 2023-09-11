import { checkPeriod, excludeKeys } from '../../utils';
import { useAppData } from '../../hooks';
import SelectComponent from '../SelectComponent';

const Splitter = ({ data }) => {
  const { dataRef } = useAppData();

  const { SplitObj1, SplitObj2 } = data?.Properties;

  const periodSplitObj1 = checkPeriod(SplitObj1);
  const periodSplitObj2 = checkPeriod(SplitObj2);

  const keySplit1 = SplitObj1?.split('.');
  const keySplit2 = SplitObj2?.split('.');

  let firstFormData = null;
  let secondFormData = null;

  if (periodSplitObj1 == 1 && periodSplitObj2 == 1) {
    firstFormData = dataRef.current[keySplit1[0]][keySplit1[1]];
    secondFormData = dataRef.current[keySplit2[0]][keySplit2[1]];
  }

  if (periodSplitObj1 == 2 && periodSplitObj2 == 2) {
    firstFormData = dataRef.current[keySplit1[0]][keySplit1[1]][keySplit1[2]];
    secondFormData = dataRef.current[keySplit2[0]][keySplit2[1]][keySplit2[2]];
  }

  const updatedFirstForm = excludeKeys(firstFormData);
  const updatedSecondForm = excludeKeys(secondFormData);

  // Horizontal Split
  if (data?.Properties?.Style && data?.Properties?.Style == 'Horz') {
    return (
      <div>
        {/* top subform */}
        <div
          style={{
            height: data?.Properties?.Posn[0],
            position: 'relative',
          }}
        >
          {Object.keys(updatedFirstForm).map((key) => (
            <SelectComponent data={updatedFirstForm[key]} />
          ))}
        </div>

        {/* Horizontal  */}
        <div style={{ background: '#F0F0F0', height: '2px' }}></div>

        {/* Bottom subform */}
        <div style={{ position: 'absolute', flex: 1, background: 'white' }}>
          {Object.keys(updatedSecondForm).map((key) => (
            <SelectComponent data={updatedSecondForm[key]} />
          ))}
        </div>
      </div>
    );
  }

  // Vertical Split
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* LeftSubForm */}
      <div
        style={{
          width: data?.Properties?.Posn[1],

          background: 'white',
          position: 'relative',
        }}
      >
        {Object.keys(updatedFirstForm).map((key) => (
          <SelectComponent data={updatedFirstForm[key]} />
        ))}
      </div>

      {/* Splitter */}
      <div style={{ background: '#F0F0F0', width: '2px' }}></div>

      {/* right Subform */}
      <div style={{ flex: 1, background: 'white' }}>
        {Object.keys(updatedSecondForm).map((key) => (
          <SelectComponent data={updatedSecondForm[key]} />
        ))}
      </div>
    </div>
  );
};

export default Splitter;
