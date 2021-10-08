import { Container, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { HeadCell } from '../../../components/EnhancedTable';
import { shortenAddress } from '../../../libs/utils';

// mock data
const ogFollowing = [
  {
    icon: '/meebits.png',
    name: 'CryptoPunks',
    owners: '10 owners 2% supply',
  },
  {
    icon: '/meebits.png',
    name: 'CryptoPunks',
    owners: '10 owners 2% supply',
  },
  {
    icon: '/meebits.png',
    name: 'CryptoPunks',
    owners: '10 owners 2% supply',
  },
  {
    icon: '/meebits.png',
    name: 'CryptoPunks',
    owners: '10 owners 2% supply',
  },
  {
    icon: '/meebits.png',
    name: 'CryptoPunks',
    owners: '10 owners 2% supply',
  },
  {
    icon: '/meebits.png',
    name: 'CryptoPunks',
    owners: '10 owners 2% supply',
  },
];

function createData(
  from: string,
  to: string,
  token: string,
  price: number,
  datetime: Date,
  link: string,
) {
  return {
    from,
    to,
    token,
    price,
    datetime,
    link,
  };
}

const rows = [
  createData(
    shortenAddress('0x2ca4570ff0cba9655e4cad7d3dbab7600958b336'),
    shortenAddress('0x93053e20ffaa4be1d15c114c21ce0881e7fe0cf3'),
    '#091',
    0.381,
    new Date(),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x8d4daba34c92e581f928fca40e018382f7a0282a'),
    shortenAddress('0xd736900ce5669293e16029e9bfc89b0b8ba19ac0'),
    '#092',
    0.288,
    new Date('2021-09-03'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x48c04ed5691981c42154c6167398f95e8f38a7ff'),
    shortenAddress('0x4e15361fd6b4bb609fa63c81a2be19d873717870'),
    '#094',
    0.488,
    new Date('2021-07-05'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0xc58bb74606b73c5043b75d7aa25ebe1d5d4e7c72'),
    shortenAddress('0xdac17f958d2ee523a2206206994597c13d831ec7'),
    '#104',
    0.211,
    new Date('2019-04-30'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x4e5b2e1dc63f6b91cb6cd759936495434c7e972f'),
    shortenAddress('0x8d8b971126f10bae9988100a40434022860695e1'),
    '#392',
    0.699,
    new Date('2014-11-02'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0xfcc21cd45758e504544cd3bb1fd9a8185bcc1070'),
    shortenAddress('0xdac17f958d2ee523a2206206994597c13d831ec7'),
    '#003',
    0.123,
    new Date('2020-05-01'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x7360401dc9c1c1e2e45e2929255ee0b276b9ab51'),
    shortenAddress('0xda816e2122a8a39b0926bfa84edd3d42477e9efd'),
    '#049',
    1.381,
    new Date('1990-09-18'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x2ca4570ff0cba9655e4cad7d3dbab7600958b336'),
    shortenAddress('0x93053e20ffaa4be1d15c114c21ce0881e7fe0cf3'),
    '#091',
    0.381,
    new Date(),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x8d4daba34c92e581f928fca40e018382f7a0282a'),
    shortenAddress('0xd736900ce5669293e16029e9bfc89b0b8ba19ac0'),
    '#092',
    0.288,
    new Date('2019-08-21'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x48c04ed5691981c42154c6167398f95e8f38a7ff'),
    shortenAddress('0x4e15361fd6b4bb609fa63c81a2be19d873717870'),
    '#094',
    0.488,
    new Date('2017-03-23'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0xc58bb74606b73c5043b75d7aa25ebe1d5d4e7c72'),
    shortenAddress('0xdac17f958d2ee523a2206206994597c13d831ec7'),
    '#104',
    0.211,
    new Date('2019-04-30'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x4e5b2e1dc63f6b91cb6cd759936495434c7e972f'),
    shortenAddress('0x8d8b971126f10bae9988100a40434022860695e1'),
    '#392',
    0.699,
    new Date('2014-11-02'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0xfcc21cd45758e504544cd3bb1fd9a8185bcc1070'),
    shortenAddress('0xdac17f958d2ee523a2206206994597c13d831ec7'),
    '#003',
    0.123,
    new Date('2020-05-01'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
  createData(
    shortenAddress('0x7360401dc9c1c1e2e45e2929255ee0b276b9ab51'),
    shortenAddress('0xda816e2122a8a39b0926bfa84edd3d42477e9efd'),
    '#049',
    1.381,
    new Date('1990-09-18'),
    'https://etherscan.io/tx/0x765941839372dd35a612fe5bf1d05e761d16541aec26c47f588eb78e4def2f54',
  ),
];

// const highPriceData = [
//   {
//     price: 50,
//     timestamp:
//   }
// ]

const charts = [
  {
    title: 'Price Range',
    data: [
      {
        label: 'series1',
        data: [50, 40, 28, 51, 42, 109, 100],
      },
      {
        label: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
  },
  {
    title: 'Total Volume',
    data: [
      {
        label: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
  {
    title: 'Transactions',
    data: [
      {
        label: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
    ],
  },
];

const headCells: readonly HeadCell[] = [
  {
    id: 'from',
    numeric: false,
    label: 'From',
  },
  {
    id: 'to',
    numeric: false,
    label: 'To',
  },
  {
    id: 'token',
    numeric: false,
    label: 'Token',
  },
  {
    id: 'price',
    numeric: true,
    label: 'Price',
  },
  {
    id: 'datetime',
    numeric: false,
    label: 'Date',
  },
  {
    id: 'link',
    numeric: false,
    label: 'Links',
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  headerBanner: {
    height: '30vh',
    backgroundColor: 'white',
  },
  headerBar: {
    padding: '2rem 0 2rem 0',
    backgroundColor: 'black',
    color: 'white',
  },
  dataContainer: {
    border: 'white solid 1px',
    padding: '2rem',
    borderRadius: '10px',
  },
  dataContainerTitle: { fontWeight: 600, marginRight: '1rem', color: theme.palette.grey[400] },
  dataContainerData: { fontWeight: 700, marginRight: '1rem', color: theme.palette.primary.main },
  dataEthPrice: { fontWeight: 700, marginRight: '1rem', color: 'white' },
  section: { marginBottom: '5rem' },
  sectionTitle: { fontWeight: 700, marginBottom: '2rem' },
  ogDataContainer: { display: 'flex', alignItems: 'center', flexDirection: 'column' },

  ogInfoContainer: { display: 'flex', alignItems: 'center', marginBottom: '1rem' },
  ogInfoData: { fontWeight: 700, color: theme.palette.secondary.main },
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

interface Props {
  collection: any;
}

const NftData = ({ collection }: Props) => {
  const classes = useStyles();
  const toFixed = (value: string) => parseFloat(`${value}`).toFixed(3);

  return (
    <div>
      <div style={{ padding: '3rem', paddingRight: 0 }}>
        {/* data */}
        <div className={classes.section}>
          <Grid container spacing={4} style={{ marginBottom: '2rem' }} alignItems="stretch">
            <Grid item xs={12} md={6} lg={3}>
              <div className={classes.dataContainer}>
                <Typography variant="body1" className={classes.dataContainerTitle}>
                  Transactions in last 24h
                </Typography>
                <Typography variant="h5" className={classes.dataContainerData}>
                  {collection.stats.one_day_sales}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <div className={classes.dataContainer}>
                <Typography variant="body1" className={classes.dataContainerTitle}>
                  Volume in last 24h
                </Typography>
                <Grid container alignItems="center">
                  <img
                    style={{ marginRight: 8 }}
                    height={24}
                    src="/collection/DOKOasset_EthereumBlue.png"
                    alt=""
                  />
                  <Typography display="inline" variant="h5" className={classes.dataContainerData}>
                    {toFixed(collection.stats.one_day_volume)}
                  </Typography>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <div className={classes.dataContainer}>
                <Typography variant="body1" className={classes.dataContainerTitle}>
                  Average price in last 24h
                </Typography>
                <Grid container alignItems="center">
                  <img
                    style={{ marginRight: 8 }}
                    height={24}
                    src="/collection/DOKOasset_EthereumBlue.png"
                    alt=""
                  />
                  <Typography display="inline" variant="h5" className={classes.dataContainerData}>
                    {toFixed(collection.stats.one_day_average_price)}
                  </Typography>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <div className={classes.dataContainer}>
                <Typography variant="body1" className={classes.dataContainerTitle}>
                  Price change in last 24h
                </Typography>
                <Grid container alignItems="center">
                  <img
                    style={{ marginRight: 8 }}
                    height={24}
                    src="/collection/DOKOasset_EthereumBlue.png"
                    alt=""
                  />
                  <Typography display="inline" variant="h5" className={classes.dataContainerData}>
                    {toFixed(collection.stats.one_day_change)}
                  </Typography>
                </Grid>
              </div>
            </Grid>
          </Grid>
          {/* charts */}
          {/* <div className={classes.section}>
              <Grid container spacing={4}>
                {charts.map(chart => (
                  <Grid key={chart.title} item xs={4}>
                    <LineChart height={300} title={chart.title} data={chart.data}/>
                  </Grid>
                ))}
              </Grid>
            </div> */}
        </div>
        <div style={{ margin: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <div>
              <img src="/DOKO_Lockup.png" height={40} alt="" style={{ marginBottom: '2rem' }} />
            </div>

            <Typography variant="h4" style={{ marginTop: 64 }}>
              MORE FEATURES ARE
            </Typography>
            <Typography variant="h3" style={{ marginTop: 24, fontWeight: 600 }}>
              COMING SOON
            </Typography>
          </div>
        </div>

        {/* <div className={classes.section}>
            <Typography variant="h5" className={classes.sectionTitle}>
              OG Following
            </Typography>
            <Grid container spacing={4}>
              {ogFollowing.map(og => (
                <Grid key={og.name} item xs={4}>
                  <div className={`${classes.dataContainer} ${classes.ogDataContainer}`}>
                    <div className={classes.ogInfoContainer}>
                      <img height={30} src={og.icon} alt="" style={{ marginRight: '1rem' }} />
                      <Typography variant="body1" className={classes.dataContainerTitle}>
                        {og.name}
                      </Typography>
                    </div>
                    <Typography variant="h6" className={classes.ogInfoData}>
                      {og.owners}
                    </Typography>
                  </div>
                </Grid>
              ))}
            </Grid>
          </div>
          <div className={classes.section}>
            <EnhancedTable
              tableTitle="Transaction History"
              rows={rows}
              headCells={headCells}
              unsortableHeaderIds={['link']}
              priceHeaderIds={['price']}
              dateFilterHeaderId="datetime"
            />
          </div> */}
      </div>
    </div>
  );
};

export default NftData;
