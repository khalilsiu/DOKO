import { LazyLoadImage } from "react-lazy-load-image-component";
import { Card, CardContent, makeStyles } from "@material-ui/core";

interface NFTItemProps {
  nft: any;
}

export const NFTItem = ({ nft }: NFTItemProps) => {
  if (nft.image.indexOf("ipfs") === 0) {
    nft.image = `https://ipfs.io/${nft.image.replace("ipfs://", "ipfs/")}`;
  }
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <LazyLoadImage
          className={styles.image}
          alt=""
          width="100%"
          src={nft.image}
        />
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  card: {
    height: "100%",
    borderRadius: 12,
    background: "white",
  },
  cardContent: {
    padding: 10,
  },
  image: {
    borderRadius: 12,
    maxHeight: 400,
  },
}));
