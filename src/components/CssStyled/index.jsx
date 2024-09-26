import { excludeKeys } from '../../utils';
import SelectComponent from '../SelectComponent';

const addId = (id, stylesheetDefs) => {
    if (!Array.isArray(stylesheetDefs)) {
        stylesheetDefs = [stylesheetDefs];
    }
    return stylesheetDefs.map((x) => `[id="${id}"] ` + x);
};

const CssStyled = ({ data }) => {
    const stylesheet = addId(data.ID, data.Properties.StyleSheet).join('\n');
    const children = excludeKeys(data);
    return (
        <div id={data.ID} style={{position: 'static'}}>
            <style>{stylesheet}</style>
            {
                Object.keys(children).map((key) => {
                    return <SelectComponent key={key} data={children[key]} />
                })
            }
        </div>
    );
};

export default CssStyled;