import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Card,
  Grid,
  Input,
  makeStyles,
  Typography,
} from "@material-ui/core";

import { User } from "../../interfaces";
import { State } from "../../store";
import { config } from "../../config";
import { NFTItem } from "./NFTItem";
import { useMoralis } from "react-moralis";
import { useCallback } from "react";

export const NftCollections = () => {
  // const user = useSelector<State, User>((state) => state.auth.user);
  const [allNfts, setAllNfts] = useState<Moralis.NFTResult[]>([]);
  const [visibleNfts, setVisibleNfts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const { Moralis } = useMoralis();
  const [address, setAddress] = useState(config.testAccount);
  const styles = useStyles();

  const fetchAllNFTs = () => {
    if (address) {
      Moralis.Web3.getNFTs({
        address,
        chain: "eth",
      }).then((nfts: Moralis.NFTResult[]) => {
        console.log(nfts);
        setAllNfts(
          nfts.sort((a, b) =>
            (a.name as string) > (b.name as string) ? 1 : -1
          )
        );
        setIndex(0);
        setVisibleNfts([]);
      });
    } else {
      setAllNfts([]);
      setIndex(0);
      setVisibleNfts([]);
    }
  };

  useEffect(() => {
    fetchAllNFTs();
  }, []);

  useEffect(() => {
    if (!allNfts.length) {
      return;
    }
    const nftsToFetch = allNfts.slice(index, index + 9);

    const fetchNFTMetadata = async () => {
      const newNfts: any[] = [];

      for (let i = 0; i < nftsToFetch.length; i++) {
        const nft = nftsToFetch[i];

        try {
          const res = await fetch(
            `https://thawing-harbor-82762.herokuapp.com/${nft.token_uri}`
          );
          const data = await res.json();
          const newNft = {
            ...nft,
            ...data,
            image: data.image || data.image_url || "",
          };
          newNfts.push(newNft);
        } catch (err) {}
      }
      setVisibleNfts((value) => value.concat(newNfts));
    };

    fetchNFTMetadata();
    // Promise.all(
    //   nftsToFetch.map((nft) =>
    //     fetch(
    //       `https://thawing-harbor-82762.herokuapp.com/${nft.token_uri}`
    //     ).then((res) => res.json())
    //   )
    // ).then((nfts) => {
    //   const newNfts = nfts.map((nft, index) => ({
    //     ...nft,
    //     ...nftsToFetch[index],
    //     image: nft.image || nft.image_url || "",
    //   }));

    //   console.log(newNfts);

    //   setVisibleNfts(visibleNfts.concat(newNfts));
    // });
  }, [index, allNfts]);

  return (
    <Grid container wrap="nowrap" className={styles.collectionContainer}>
      <Grid item md={4}>
        <Card style={{ height: 600, margin: "0 24px" }}></Card>
      </Grid>
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        style={{ padding: 24 }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="h4" gutterBottom>
            NFT Collection
          </Typography>
          <Grid spacing={1}>
            <Input
              style={{ width: 390 }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button variant="outlined" onClick={() => fetchAllNFTs()}>
              Search
            </Button>
          </Grid>
        </Grid>
        <Grid container wrap="wrap" alignItems="stretch" spacing={2}>
          {visibleNfts.map((nft, index) => (
            <Grid
              item
              key={`${nft.token_address}-${nft.token_id}`}
              lg={3}
              md={4}
              xs={6}
            >
              <NFTItem nft={nft} />
            </Grid>
          ))}
        </Grid>
        {visibleNfts.length && visibleNfts.length < allNfts.length ? (
          <Button
            style={{ margin: "24px 0" }}
            variant="outlined"
            color="primary"
            onClick={() => setIndex(index + 9)}
          >
            Show More
          </Button>
        ) : (
          <></>
        )}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  collectionContainer: {
    marginTop: 36,
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
}));
