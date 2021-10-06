import { useEffect, useState } from 'react';
import { Grid, Typography, withStyles } from '@material-ui/core';
import Web3 from 'web3';

import ethIcon from './assets/eth.png';
import bscIcon from './assets/bsc.png';
import polygonIcon from './assets/polygon.png';
import solanaIcon from './assets/solana.png';
import { getAllEthAssets, getNFTsCount } from './api';
import SectionLabel from '../../components/SectionLabel';

const ChainContainer = withStyles({
  root: {
    padding: '28px 30px',
    borderRadius: 15,
    border: '2px solid white',
    marginTop: 10,
  },
})(Grid);

interface Props {
  address: string;
}

export const Summary = ({ address }: Props) => {
  const [chains, setChains] = useState([
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
  ]);

  const fetchNFTsCount = async () => {
    const { data } = await getNFTsCount(address);
    const ethNFTs = await getAllEthAssets(address);
    const chainData = JSON.parse(JSON.stringify(chains));
    chainData[0].count = ethNFTs.length;
    chainData[1].count = data.bsc;
    chainData[2].count = data.polygon;

    const collections: { [key: string]: string } = ethNFTs.reduce((col, nft) => {
      if (!nft.last_sale || nft.last_sale.payment_token.name !== 'Ether') {
        return col;
      }
      if (!col[nft.collection.name]) {
        // eslint-disable-next-line no-param-reassign
        col[nft.collection.name] = nft.last_sale.total_price;
        return col;
      }
      const prev = col[nft.collection.name];

      if (Web3.utils.toBN(prev).gte(Web3.utils.toBN(nft.last_sale.total_price))) {
        // eslint-disable-next-line no-param-reassign
        col[nft.collection.name] = nft.last_sale.total_price;
      }
      return col;
    }, {});

    const sumETH = Object.values(collections).reduce(
      (sum, price: string) => Web3.utils.toBN(price).add(sum),
      Web3.utils.toBN(0),
    );

    chainData[0].price = Web3.utils.fromWei(sumETH, 'ether');

    setChains(chainData);
  };

  useEffect(() => {
    fetchNFTsCount();
  }, [address]);

  return (
    <>
      <SectionLabel variant="h5" gutterBottom>
        Summary
      </SectionLabel>
      <Grid style={{ marginTop: 32, marginBottom: 64 }} container spacing={2}>
        {chains.map((item) => (
          <Grid item key={item.name} xs={12} sm={6} xl={3}>
            <Grid container alignItems="center">
              <img width={30} src={item.icon} alt={item.name} />
              <Typography
                style={{ marginLeft: 12, fontWeight: 700, fontSize: 14 }}
                component="strong"
              >
                {item.name}
              </Typography>
            </Grid>
            <ChainContainer container wrap="nowrap">
              <Grid item>
                <Typography style={{ fontSize: 14 }}>Total NFTs</Typography>
                <Typography style={{ fontSize: 18, fontWeight: 700 }}>{item.count}</Typography>
              </Grid>
              <Grid item style={{ marginLeft: 48 }}>
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
                      {item.price}
                    </Grid>
                  ) : (
                    'Coming Soon'
                  )}
                </Typography>
              </Grid>
            </ChainContainer>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Summary;
