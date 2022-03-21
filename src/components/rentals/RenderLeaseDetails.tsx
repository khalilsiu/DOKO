import { Typography, Grid, makeStyles } from '@material-ui/core';
import { LeaseMode } from 'components/profile/OwnershipView';
import { Fragment, memo, useMemo } from 'react';
import LeaseLengthSelect from './LeaseLengthSelect';

interface IProps {
  assetDetails: {
    tokenLabel: string;
    tokenSymbol: string;
    leaseAmount: string;
    deposit: string;
    gracePeriod: string;
    leaseLengths: number[];
    finalLeaseLength: string;
  };
  finalLeaseLength: number;
  handleSelectChange: (e: any) => void;
  mode: LeaseMode;
}

interface AssetDetailRow {
  title: string;
  detail: React.ReactNode | string;
}

const RenderLeaseDetails = ({ assetDetails, finalLeaseLength, handleSelectChange, mode }: IProps) => {
  const styles = useStyles();
  const assetDetailsRows: AssetDetailRow[][] = useMemo(() => {
    return [
      [
        {
          title: 'Lease Token',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {assetDetails.tokenLabel}
            </Typography>
          ),
        },
        {
          title: 'Lease Amount',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {assetDetails.leaseAmount} {assetDetails.tokenSymbol} per month
            </Typography>
          ),
        },
      ],
      [
        {
          title: 'Lease Length',
          detail:
            mode === 'lease' ? (
              <LeaseLengthSelect
                finalLeaseLength={finalLeaseLength}
                handleSelectChange={handleSelectChange}
                leaseLengths={assetDetails.leaseLengths}
              />
            ) : (
              <Typography variant="subtitle2" className={styles.detailItem}>
                {assetDetails.finalLeaseLength} months
              </Typography>
            ),
        },
        {
          title: 'Security Deposit Amount',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {assetDetails.deposit} ${assetDetails.tokenSymbol}
            </Typography>
          ),
        },
      ],
      [
        {
          title: 'Grace Period',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {assetDetails.gracePeriod} days
            </Typography>
          ),
        },
        {
          title: 'Lease Amount',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {assetDetails.leaseAmount} {assetDetails.tokenSymbol} per month,
            </Typography>
          ),
        },
      ],
    ];
  }, [mode, assetDetails, finalLeaseLength, handleSelectChange]);

  return (
    <Fragment>
      {assetDetailsRows.map((row) => (
        <Grid container spacing={2} className={styles.modalContentRow} style={{ display: 'flex' }}>
          {row.map((column) => (
            <Grid key={column.title} sm={12} md={6} item style={{ width: '100%' }}>
              <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                {column.title}
              </Typography>
              {column.detail}
            </Grid>
          ))}
        </Grid>
      ))}
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  modalContentRow: { marginBottom: '0.7rem' },
  detailItem: {
    fontSize: '0.8rem',
    color: theme.palette.grey[400],
  },
}));

export default memo(RenderLeaseDetails);
