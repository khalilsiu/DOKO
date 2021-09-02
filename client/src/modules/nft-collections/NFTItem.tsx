import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  MenuList,
  Typography
} from '@material-ui/core';
import eth from './assets/eth.png';
import bsc from './assets/bsc.png';
import polygon from './assets/polygon.png';
import activeShare from './assets/active-share.png';
import inactiveShare from './assets/inactive-share.png';
import facebook from './assets/facebook.png';
import twitter from './assets/twitter.png';
import instagram from './assets/instagram.png';
import Popover from '../../components/Popover';
interface NFTItemProps {
  nft: any;
}

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><g class="gotchi-bg"><defs fill="#fff"><pattern id="a" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M0 0h1v1H0zm2 2h1v1H2z"/></pattern><pattern id="b" patternUnits="userSpaceOnUse" x="0" y="0" width="2" height="2"><path d="M0 0h1v1H0z"/></pattern><pattern id="c" patternUnits="userSpaceOnUse" x="-2" y="0" width="8" height="1"><path d="M0 0h1v1H0zm2 0h1v1H2zm2 0h1v1H4z"/></pattern><pattern id="d" patternUnits="userSpaceOnUse" x="0" y="0" width="4" height="4"><path d="M0 0h1v1H0zm0 2h1v1H0zm1 0V1h1v1zm1 0h1v1H2zm0-1h1V0H2zm1 2h1v1H3z"/></pattern><pattern id="e" patternUnits="userSpaceOnUse" width="64" height="32"><path d="M4 4h1v1H4zm7 0h1v1h-1zm7 0h1v1h-1zm7 0h1v1h-1zm7 0h1v1h-1zm7 0h1v1h-1zm7 0h1v1h-1zm7 0h1v1h-1zm7 0h1v1h-1z"/><path fill="url(#a)" d="M0 8h64v7H0z"/><path fill="url(#b)" d="M0 16h64v1H0z"/><path fill="url(#c)" d="M0 18h64v1H0z"/><path fill="url(#b)" d="M22 18h15v1H22zM0 20h64v3H0z"/><path fill="url(#d)" d="M0 24h64v8H0z"/></pattern><mask id="f"><path fill="url(#e)" d="M0 0h64v32H0z"/></mask></defs><path fill="#fff" d="M0 0h64v32H0z"/><path fill="#dea8ff" class="gotchi-secondary" mask="url(#f)" d="M0 0h64v32H0z"/><path fill="#dea8ff" class="gotchi-secondary" d="M0 32h64v32H0z"/><path mask="url(#f)" fill="#fff" transform="matrix(1 0 0 -1 0 64)" d="M0 0h64v32H0z"/></g><style>.gotchi-primary{fill:#26A17B;}.gotchi-secondary{fill:#AEDCCE;}.gotchi-cheek{fill:#F696C6;}.gotchi-eyeColor{fill:#5D24BF;}.gotchi-primary-mouth{fill:#26A17B;}.gotchi-sleeves-up{display:none;}.gotchi-handsUp{display:none;}.gotchi-handsDownOpen{display:block;}.gotchi-handsDownClosed{display:none;}</style><g class="gotchi-body"><g class="gotchi-primary"><path d="M21 12h2v-2h-4v2h1z"/><path d="M19 14v-2h-2v2h1zm6-4h2V8h-4v2h1z"/><path d="M29 8h8V6H27v2h1zm16 6h2v-2h-2v1z"/><path d="M48 14h-1v39h-2v2h4V14zm-11-4h4V8h-4v1z"/><path d="M41 12h4v-2h-4v1zM17 53V14h-2v41h4v-2h-1z"/><path d="M24 51h-5v2h5v-1z"/><path d="M27 53h-3v2h5v-2h-1zm18-2h-5v2h5v-1z"/><path d="M35 51h-6v2h6v-1z"/><path d="M38 53h-3v2h5v-2h-1z"/></g><g class="gotchi-secondary"><path d="M18 43v6h2v-1h2v1h2v2h-5v2h-2V14h2v1h-1v26z"/><path d="M27 51h-3v2h5v-2h-1zm11 0h-3v2h5v-2h-1z"/><path d="M35 49h-2v-1h-2v1h-2v2h6v-1zM25 11h2v-1h-4v1h1zm-4 2h2v-1h-4v1h1zm24 31v5h-1v-1h-2v1h-2v2h5v2h2V14h-2v29z"/><path d="M37 8H27v1h5v1h5V9zm8 4h-4v2h4v-1z"/><path d="M41 10h-4v2h4v-1z"/></g><path d="M44 14h-3v-2h-4v-2h-5V9h-5v2h-4v2h-4v2h-1v34h2v-1h2v1h2v2h5v-2h2v-1h2v1h2v2h5v-2h2v-1h2v1h1V14z" fill="#fff"/></g><path class="gotchi-cheek" d="M21 32v2h2v-2h-1zm21 0h-1v2h2v-2z"/><g class="gotchi-primary-mouth"><path d="M29 32h-2v2h2v-1z"/><path d="M33 34h-4v2h6v-2h-1z"/><path d="M36 32h-1v2h2v-2z"/></g><g class="gotchi-shadow"><path opacity=".25" d="M25 58H19v1h1v1h24V59h1V58h-1z" fill="#000"/></g><g class="gotchi-collateral" fill="#26a17b"><path d="M31 19h2v3h-2zm0-2v1h2v-1h3v-1h-3v-1h2v-2h-6v2h2v1h-3v1z"/><path d="M27 17h1v1h-1z"/><path d="M28 18h3v1h-3zm8-1h1v1h-1z"/><path d="M33 18h3v1h-3z"/></g><g class="gotchi-eyeColor"><path d="M23 28V29V30H24H25H26H27V29V28H28H29V27V26V25V24H28H27V23V22H26H25H24H23V23V24H22H21V25V26V27V28H22H23Z" /><path d="M35 24V25V26V27V28H36H37V29V30H38H39H40H41V29V28H42H43V27V26V25V24H42H41V23V22H40H39H38H37V23V24H36H35Z" /></g><g class="gotchi-wearable wearable-body"><svg x="15" y="33"><path d="M26 5v1h-2v1h-2 0-1v1h-2v1h-4V8h-2V7h-1 0-2V6H8V5H7V4H6V3H5V2H4V1H3V0H0v22h4v-2h5v2h5v-2h6v2h5v-2h5v2h4V0h-3v1h-1v1h-1v1h-1v1h-1v1h-1z"/><path d="M32 1v19h1V1h-1zm-3 3h-1v1h-1v1h-1v1h-2v1h-2 0-1v1h-2v1h-4V9h-2V8h-1 0-2V7H8V6H7V5H6V4H5V3H4v16h6v1h3v-1h8v1h3v-1h6v-2h-5v-1h5V3h-1v1zM1 20h1V1H1v19z" fill="red"/><path d="M18 15.5v1h2v-1h-2zm-3-2h-1v1h2v-2h-1v1zm5-1h1v1h-1v-1z"/><path d="M18 11.5v1h2v-1h-2zm0 2v1h2v-1h-2zm-5-2v1h2v-1h-2zm0 5h3v-1h-2v-1h-1v2z"/><path d="M20 14.5h1v1h-1v-1z"/><path d="M32 20h1v1h-1v-1zm-2 0h1V2h-1v18zm-9 0v1h3v-1h-3zM1 20h1v1H1v-1zm2 0h1V2H3v18zm7 0v1h3v-1h-3z" fill="#fff"/></svg></g><g class="gotchi-handsDownClosed"><g class="gotchi-primary"><path d="M19 42h1v1h-1zm1-6h1v1h-1z"/><path d="M21 37h1v1h-1zm5 3v4h1v-4zm-5 3h-1v1h2v-1z"/><path d="M24 44h-2v1h4v-1h-1zm1-5h-1v1h2v-1z"/><path d="M23 38h-1v1h2v-1z"/></g><g class="gotchi-secondary"><path d="M19 43h1v1h-1zm5 2h-2v1h4v-1h-1z"/><path d="M27 41v3h1v-3zm-6 3h-1v1h2v-1z"/><path d="M26 44h1v1h-1zm-7-3h-1v2h1v-1z"/></g><g class="gotchi-primary"><path d="M44 42h1v1h-1zm-1-6h1v1h-1z"/><path d="M42 37h1v1h-1z"/><path d="M42 39v-1h-2v1h1zm0 4v1h2v-1h-1z"/><path d="M40 44h-2v1h4v-1h-1z"/><path d="M38 42v-2h-1v4h1v-1z"/><path d="M40 40v-1h-2v1h1z"/></g><g class="gotchi-secondary"><path d="M42 44v1h2v-1h-1zm-5-2v-1h-1v3h1v-1z"/><path d="M40 45h-2v1h4v-1h-1z"/><path d="M37 44h1v1h-1zm7-1h1v1h-1z"/></g></g><g class="gotchi-handsDownOpen"><g class="gotchi-primary"><path d="M14 40h1v1h-1v-1zm-1-6h1v1h-1v-1z"/><path d="M14 33h1v1h-1v-1zm-2 2h1v1h-1v-1zm-5 3h1v4H7v-4zm5 3h2v1h-2v-1z"/><path d="M8 42h4v1H8v-1zm0-5h2v1H8v-1z"/><path d="M10,36h2v1h-2V36z"/></g><g class="gotchi-secondary"><path d="M14,39h1v1h-1V39z"/><path d="M12,40h2v1h-2V40z"/><path d="M8,41h4v1H8V41z"/></g><path d="M8,38v3h4v-1h2v-1h1v-5h-1v1h-1v1h-1v1h-2v1H8z" fill="#fff" /><g class="gotchi-primary"><path d="M49 40h1v1h-1v-1zm1-6h1v1h-1v-1z"/><path d="M49 33h1v1h-1v-1zm2 2h1v1h-1v-1zm5 3h1v4h-1v-4zm-6 3h2v1h-2v-1z"/><path d="M52 42h4v1h-4v-1zm2-5h2v1h-2v-1z"/><path d="M52,36h2v1h-2V36z"/></g><g class="gotchi-secondary"><path d="M49,39h1v1h-1V39z"/><path d="M50,40h2v1h-2V40z"/><path d="M52,41h4v1h-4V41z"/></g><path d="M54,38v-1h-2v-1h-1v-1h-1v-1h-1v5h1v1h2v1h4v-3H54z" fill="#fff" /></g><g class="gotchi-handsUp"><g class="gotchi-secondary"><path d="M50,38h1v1h-1V38z"/><path d="M49 39h1v1h-1v-1zm2-2h1v1h-1v-1z"/><path d="M52,36h2v1h-2V36z"/><path d="M54,35h2v1h-2V35z"/></g><path d="M52,32v1h-2v1h-1v5h1v-1h1v-1h1v-1h2v-1h2v-3H52z" fill="#fff"/><g class="gotchi-primary"><path d="M49,33h1v1h-1V33z"/><path d="M50 32h2v1h-2v-1zm0 7h1v1h-1v-1z"/><path d="M49 40h1v1h-1v-1zm2-2h1v1h-1v-1z"/><path d="M52 37h2v1h-2v-1zm0-6h4v1h-4v-1z"/><path d="M56,32h1v4h-1V32z"/><path d="M54,36h2v1h-2V36z"/></g><g class="gotchi-secondary"><path d="M13,38h1v1h-1V38z"/><path d="M14 39h1v1h-1v-1zm-2-2h1v1h-1v-1z"/><path d="M10,36h2v1h-2V36z"/><path d="M8,35h2v1H8V35z"/></g><path d="M8,32v3h2v1h2v1h1v1h1v1h1v-5h-1v-1h-2v-1H8z" fill="#fff"/><g class="gotchi-primary"><path d="M14,33h1v1h-1V33z"/><path d="M12 32h2v1h-2v-1zm1 7h1v1h-1v-1z"/><path d="M14 40h1v1h-1v-1zm-2-2h1v1h-1v-1z"/><path d="M10 37h2v1h-2v-1zm-2-6h4v1H8v-1z"/><path d="M7,32h1v4H7V32z"/><path d="M8,36h2v1H8V36z"/></g></g></svg>';

export const NFTItem = ({ nft }: NFTItemProps) => {
  if (nft.metadata && !nft.metadata.image && nft.metadata.image_data) {
    nft.metadata.image = nft.metadata.image_data;
  }

  if (nft.metadata?.image?.indexOf('ipfs') === 0) {
    nft.metadata.image = `https://ipfs.io/${nft.metadata.image
      .replace('ipfs/', '')
      .replace('ipfs://', 'ipfs/')}`;
  }
  const styles = useStyles();

  const [shareActive, setShareActive] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <CardContent className={styles.cardContent}>
          <Grid container alignItems="center" style={{ flex: 1 }}>
            {nft.metadata.image &&
              (nft.metadata.image.indexOf('<svg') === 0 ? (
                <div
                  style={{ flex: 1 }}
                  dangerouslySetInnerHTML={{ __html: svg }}
                  className={styles.image}
                />
              ) : (
                <LazyLoadImage
                  className={styles.image}
                  alt=""
                  width="100%"
                  src={nft.metadata.image}
                />
              ))}
          </Grid>
          <Typography className={styles.nftName} variant="caption">
            {nft.metadata?.name || nft.name || '-'}
          </Typography>
        </CardContent>
        <CardActions className={styles.cardActions}>
          <img
            className={styles.networkIcon}
            width="12px"
            src={{ eth, bsc, polygon }[nft.chain as string]}
            alt={nft.chain}
          />
          <Popover
            reference={
              <IconButton
                onMouseEnter={() => setShareActive(true)}
                onMouseLeave={() => setShareActive(false)}
              >
                {shareActive ? (
                  <img className={styles.shareIcon} src={activeShare} alt="share" />
                ) : (
                  <img className={styles.shareIcon} src={inactiveShare} alt="share" />
                )}
              </IconButton>
            }
            placement="bottom-end"
          >
            <MenuList>
              <MenuItem className={styles.shareItem}>
                <img src={facebook} alt="facebook" />
                Share on Facebook
              </MenuItem>
              <MenuItem className={styles.shareItem}>
                <img src={twitter} alt="twitter" />
                Share on Twitter
              </MenuItem>
              <MenuItem className={styles.shareItem}>
                <img src={instagram} alt="instagram" />
                Share on Instagram
              </MenuItem>
            </MenuList>
          </Popover>
        </CardActions>
      </Card>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: '100%',
    borderRadius: 12,
    backgroundClip: 'padding-box',
    border: 'solid 3px transparent',
    position: 'relative',
    '&:hover': {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background:
          'linear-gradient(-45deg, rgba(63,199,203,1) 0%, rgba(63,199,203,1) 30%, rgba(80,92,176,1) 50%, rgba(148,64,161,1) 80%, rgba(226,69,162,1) 100%)',
        borderRadius: 'inherit',
        margin: -3,
        zIndex: -1
      }
    }
  },
  card: {
    height: '100%',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },
  cardContent: {
    padding: 6,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  nftName: {
    fontWeight: 'bold',
    marginLeft: 8,
    color: 'black'
  },
  image: {
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    maxHeight: 400,
    minHeight: 200
  },
  networkIcon: {
    width: 10,
    marginLeft: 8,
    marginBottom: 8
  },
  shareIcon: {
    width: 20
  },
  shareItem: {
    '&:hover': {
      background: theme.palette.primary.main,
      color: 'white'
    },
    '& > img': {
      width: 24,
      marginRight: 12
    }
  }
}));
