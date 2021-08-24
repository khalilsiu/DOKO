import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Share from "@material-ui/icons/Share";

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
        <Grid container alignItems="center" style={{ height: "100%" }}>
          <LazyLoadImage
            className={styles.image}
            alt=""
            width="100%"
            src={nft.image}
          />
        </Grid>
        <Typography className={styles.nftName} variant="caption">
          {nft.name}
        </Typography>
      </CardContent>
      <CardActions className={styles.cardActions}>
        <IconButton>
          <Share fontSize="small" color="primary" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

const useStyles = makeStyles(() => ({
  card: {
    height: "100%",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    background: "white",
  },
  cardContent: {
    padding: 6,
    height: "100%",
  },
  cardActions: {
    justifyContent: "flex-end",
  },
  nftName: {
    fontWeight: "bold",
    marginLeft: 8,
    color: "black",
  },
  image: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    maxHeight: 400,
  },
}));
