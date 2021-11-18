import { useEffect, useState } from 'react';
import { Grid, Typography, withStyles, makeStyles, CircularProgress } from '@material-ui/core';

import ethIcon from './assets/eth.png';
import bscIcon from './assets/bsc.png';
import polygonIcon from './assets/polygon.png';
import solanaIcon from './assets/solana.png';
import { getAllEthAssets, getFloorPrice, getNFTsCount } from './api';
import { getSolNftsCount } from '../../libs/solana';
import { isSolAddress } from '../../libs/utils';
import SectionLabel from '../../components/SectionLabel';

const ChainContainer = withStyles((theme) => ({
  root: {
    padding: '28px 30px 24px',
    borderRadius: 15,
    border: '2px solid white',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}))(Grid);

const useStyles = makeStyles((theme) => ({
  chainInfo: {
    marginLeft: 48,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: 12,
    },
  },
}));

interface Props {
  data: any;
}

const initialData = [
  {
    icon: ethIcon,
    count: 0,
    price: 0,
    name: 'Ethereum',
    available: true,
  },
  {
    icon: bscIcon,
    count: 0,
    price: 0,
    name: 'BSC',
  },
  {
    icon: polygonIcon,
    count: 0,
    price: 0,
    name: 'Polygon',
  },
  {
    icon: solanaIcon,
    count: 0,
    price: 0,
    name: 'Solana',
  },
];

export const Summary = ({ data }: Props) => {
  const classes = useStyles();

  return (
    <>
      <SectionLabel variant="h5" gutterBottom>
        Summary
      </SectionLabel>
      <Grid style={{ marginTop: 32, marginBottom: 64 }} container spacing={2}>
        {data.summary.map((item: any) => (
          <Grid item key={item.name} xs={12} sm={6} lg={3}>
            <Grid container direction="column" style={{ height: '100%' }}>
              <Grid container alignItems="center">
                <img width={30} src={item.icon} alt={item.name} style={{ borderRadius: '50%' }} />
                <Typography
                  style={{ marginLeft: 12, fontWeight: 700, fontSize: 14 }}
                  component="strong"
                >
                  {item.name}
                </Typography>
              </Grid>
              <ChainContainer container wrap="nowrap" style={{ flex: 1 }}>
                <Grid item>
                  <Typography style={{ fontSize: 14 }}>Total NFTs</Typography>
                  <Typography style={{ fontSize: 18, fontWeight: 700 }}>{item.count}</Typography>
                </Grid>
                <Grid item className={classes.chainInfo}>
                  <Typography style={{ fontSize: 14 }}>Total Floor Price</Typography>
                  <Typography
                    component="div"
                    style={{ fontSize: 18, fontWeight: 700, opacity: item.available ? 1 : 0.5 }}
                  >
                    {item.available ? (
                      <Grid container alignItems="center">
                        <img
                          style={{ marginRight: 8 }}
                          src="/collection/DOKOasset_EthereumBlue.png"
                          width={10}
                          alt="ETH"
                        />
                        {parseFloat(`${item.price}`).toFixed(3)}
                      </Grid>
                    ) : (
                      'Coming Soon'
                    )}
                  </Typography>
                  {item.loading && <CircularProgress />}
                </Grid>
              </ChainContainer>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Summary;
