import { makeStyles, Typography, useTheme } from '@material-ui/core';
import { AggregatedSummary } from 'hooks/summary/aggregateSummaries';
import { memo, useMemo } from 'react';
import Bullet from './Bullet';
import ethBlueIcon from 'assets/tokens/eth-blue.png';
import { LeaseStatus } from 'store/lease/leasesSlice';

interface IBulletSection {
  metaverseSummaries: AggregatedSummary[];
}

const BulletSection = ({ metaverseSummaries }: IBulletSection) => {
  const theme = useTheme();
  const styles = useStyles();
  const bullets = useMemo(() => {
    let totalParcels = 0;
    let totalFloorPrice = 0;
    let totalLandsListed = 0;
    let totalLandsLeased = 0;

    metaverseSummaries.forEach((collection) => {
      totalParcels += collection.assets.length;
      totalFloorPrice += collection.totalFloorPrice;
      totalLandsListed += collection.leasedAssets.length;
      totalLandsLeased += collection.leasedAssets.reduce((leased, asset) => {
        if (asset.lease && asset.lease.status === LeaseStatus.LEASED) {
          leased++;
        }
        return leased;
      }, 0);
    });
    return [
      {
        value: 'parcels',
        color: theme.palette.primary.main,
        data: [
          {
            title: <Typography className={styles.bulletTitle}>Total Parcels</Typography>,
            value: <Typography className={styles.bulletText}>{totalParcels}</Typography>,
          },
          {
            title: <Typography className={styles.bulletTitle}>Total Floor Price</Typography>,
            value: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img style={{ marginRight: 8 }} src={ethBlueIcon} alt="ETH" width={10} />
                <Typography className={styles.bulletText}>{totalFloorPrice}</Typography>
              </div>
            ),
          },
        ],
      },
      {
        value: 'leases',
        color: theme.palette.secondary.main,
        data: [
          {
            title: <Typography className={styles.bulletTitle}>Lands Listed</Typography>,
            value: <Typography className={styles.bulletText}>{totalLandsListed}</Typography>,
          },
          {
            title: <Typography className={styles.bulletTitle}>Lands Leased</Typography>,
            value: <Typography className={styles.bulletText}>{totalLandsLeased}</Typography>,
          },
        ],
      },
    ];
  }, [metaverseSummaries]);
  return (
    <div className={styles.totalSummary}>
      {bullets.map((bullet) => (
        <Bullet key={bullet.value} data={bullet.data} className={styles.bulletStyle} color={bullet.color} />
      ))}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  totalSummary: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: theme.spacing(3),
  },
  bulletTitle: { fontSize: 14 },
  bulletText: { fontSize: 18, fontWeight: 700 },
  bulletStyle: { marginRight: theme.spacing(3) },
}));

export default memo(BulletSection);
