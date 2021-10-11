import { makeStyles, Theme, Typography, useTheme } from '@material-ui/core';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  chartContainer: {
    border: 'white solid 1px',
    padding: '2rem 1rem',
    borderRadius: '10px',
  },
  daysFilter: {
    padding: '0.4rem 0.7rem',
    width: '3.5rem',
    borderRadius: '4px',
    border: 'solid 2px',
    marginLeft: '0.5rem',
    borderColor: theme.palette.grey[700],
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface IProps {
  data: { label: string; data: number[] }[];
  title: string;
  height: number;
}

const daysFilter = [
  {
    label: '1D',
    value: 1,
  },
  {
    label: '7D',
    value: 7,
  },
  {
    label: '30D',
    value: 30,
  },
  {
    label: '90D',
    value: 90,
  },
  {
    label: 'All',
    value: 'all',
  },
];

const LineChart = ({ data, title, height }: IProps) => {
  const classes = useStyles();
  const theme = useTheme<Theme>();
  const [daysToFilter, setDaysToFilter] = useState<number | string>('all');

  const chartDataOptions: ApexOptions = {
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2021-10-01 20:00:00',
        '2021-10-01 21:00:00',
        '2021-10-01 22:00:00',
        '2021-10-01 23:00:00',
        '2021-10-02 00:00:00',
        '2021-10-02 01:00:00',
        '2021-10-01 02:00:00',
      ],
      labels: {
        style: {
          colors: 'white',
          fontSize: '12px',
        },
      },
    },
    grid: {
      borderColor: 'grey',
    },
    yaxis: {
      labels: {
        style: {
          colors: 'white',
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  };
  return (
    <div className={classes.chartContainer}>
      <Typography
        variant="body1"
        style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 700 }}
      >
        {title}
      </Typography>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        {daysFilter.map((days) => (
          // eslint-disable-next-line max-len
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            key={days.label}
            className={classes.daysFilter}
            onClick={() => setDaysToFilter(days.value)}
            style={{ ...(days.value === daysToFilter && { borderColor: 'white' }) }}
          >
            <Typography variant="subtitle2" style={{ fontWeight: 700 }}>
              {days.label}
            </Typography>
          </div>
        ))}
      </div>
      <ReactApexChart options={chartDataOptions} series={data} type="area" height={height} />
    </div>
  );
};

export default LineChart;
