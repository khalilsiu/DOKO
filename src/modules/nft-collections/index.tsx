import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Grid } from "@material-ui/core";

import Moralis from "../../helper/moralis";
import { User } from "../../interfaces";
import { State } from "../../store";
import { config } from "../../config";
import { NFTItem } from "./NFTItem";

export const NftCollections = () => {
  const user = useSelector<State, User>((state) => state.auth.user);
  const [allNfts, setAllNfts] = useState<Moralis.NFTResult[]>([]);
  const [visibleNfts, setVisibleNfts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (user.address) {
      (Moralis as any).Web3.getNFTs({ address: config.testAccount, limit: 20 }).then(
        (nfts: Moralis.NFTResult[]) => {
          console.log(nfts);
          setAllNfts(nfts);
          setIndex(0);
          setVisibleNfts([]);
        }
      );
    } else {
      setAllNfts([]);
      setIndex(0);
      setVisibleNfts([]);
    }
  }, [user]);

  useEffect(() => {
    if (!allNfts.length) {
      return;
    }
    const nftsToFetch = allNfts.slice(index, index + 9);
    Promise.all(
      nftsToFetch.map((nft) =>
        fetch(
          `https://thawing-harbor-82762.herokuapp.com/${nft.token_uri}`
        ).then((res) => res.json())
      )
    ).then((nfts) => {
      const newNfts = nfts.map((nft, index) => ({
        ...nft,
        ...nftsToFetch[index],
        image: nft.image || nft.image_url || "",
      }));

      console.log(newNfts);

      setVisibleNfts(visibleNfts.concat(newNfts));
    });
  }, [index, allNfts]);

  return (
    <Grid container wrap="nowrap">
      <Card style={{ width: 500, height: 600, marginLeft: 36 }}></Card>
      <Grid container direction="column">
        <Grid container wrap="wrap" alignItems="stretch">
          {visibleNfts.map((nft, index) => (
            <Grid
              item
              key={nft.token_id}
              style={{
                width: "31%",
                margin: index % 3 === 1 ? 0 : "0 24px",
                marginBottom: 24,
              }}
            >
              <NFTItem nft={nft} />
            </Grid>
          ))}
        </Grid>
        <Button
          style={{ margin: "24px 0" }}
          variant="outlined"
          color="primary"
          onClick={() => setIndex(index + 9)}
        >
          Show More
        </Button>
      </Grid>
    </Grid>
  );
};
