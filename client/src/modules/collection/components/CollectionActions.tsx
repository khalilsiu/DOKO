import { Grid, IconButton, makeStyles, MenuItem, MenuList } from '@material-ui/core';
import { Popover } from '../../../components';
import facebook from '../../../components/assets/facebook.png';
import twitter from '../../../components/assets/twitter.png';

interface Props {
  collection: any;
  // eslint-disable-next-line no-unused-vars
  onShare: (param: 'facebook' | 'twitter') => void;
}

const useStyles = makeStyles((theme) => ({
  shareItem: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white',
    },
    '& > img': {
      width: 24,
      marginRight: 12,
    },
  },
}));

export default function CollectionActions({ collection, onShare }: Props) {
  const styles = useStyles();

  return (
    <Grid container justifyContent="flex-end" spacing={1}>
      <Grid item>
        <a
          href={`https://opensea.io/collection/${collection.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconButton>
            <img width={36} src="/collection/DOKOasset_OpenSea.png" alt="" />
          </IconButton>
        </a>
      </Grid>
      <Grid item>
        <a
          href={`https://etherscan.io/address/${collection.primary_asset_contracts[0].address}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconButton>
            <img width={36} src="/collection/DOKOasset_EtherScan.png" alt="" />
          </IconButton>
        </a>
      </Grid>
      <Grid item>
        <IconButton onClick={() => window.location.reload()}>
          <img width={36} src="/collection/DOKOasset_RefreshData.png" alt="" />
        </IconButton>
      </Grid>
      <Grid item>
        <Popover
          reference={
            <IconButton>
              <img width={36} src="/collection/DOKOasset_ShareWhiteCircle.png" alt="" />
            </IconButton>
          }
          placement="bottom-end"
        >
          <MenuList>
            <MenuItem className={styles.shareItem} onClick={() => onShare('facebook')}>
              <img src={facebook} alt="facebook" />
              Share on Facebook
            </MenuItem>
            <MenuItem className={styles.shareItem} onClick={() => onShare('twitter')}>
              <img src={twitter} alt="twitter" />
              Share on Twitter
            </MenuItem>
          </MenuList>
        </Popover>
      </Grid>
    </Grid>
  );
}
