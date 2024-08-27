import { useAppData } from '../../hooks';

import { Chart, ChartSeries, ChartSeriesItem } from '@progress/kendo-react-charts';

const KendoChart = ({ data }) => {
  const { Options, Posn, Series, Size, ChartType, Event } = data?.Properties;
  const { socket } = useAppData();

  console.log(Series);
  return (
    <div style={{ position: 'absolute', top: Posn && Posn[0], left: Posn && Posn[1] }}>
      <Chart>
        <ChartSeries>
          {
            Series.map((s, i) =>
              <ChartSeriesItem data={s.data} type="column" name={"series-" + i} />
            )
          }
        </ChartSeries>
      </Chart>
    </div>
  );
};

export default KendoChart;
