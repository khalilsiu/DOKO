import { Typography, Grid, makeStyles } from '@material-ui/core';
import { LeaseMode } from 'components/profile/OwnershipView';
import { tokens } from 'constants/acceptedTokens';
import moment from 'moment';
import { Fragment, memo, useMemo } from 'react';
import { Lease } from 'store/lease/leasesSlice';
import LeaseLengthSelect from './LeaseLengthSelect';

interface IProps {
  lease?: Lease;
  finalLeaseLength: number;
  handleLeaseLengthSelect: (e: any) => void;
  mode: LeaseMode;
}

interface AssetDetailRow {
  title: string;
  detail: React.ReactNode | string;
  mode: LeaseMode | 'all';
}
const NA = 'N.A.';

const RenderLeaseDetails = ({ lease, finalLeaseLength, handleLeaseLengthSelect, mode }: IProps) => {
  const styles = useStyles();
  const rows = (
    tokenLabelText: string,
    rentAmountText: string,
    leaseLengths: number[],
    depositText: string,
    finalLeaseLengthText: string,
    gracePeriodText: string,
    leaseStatusText: string,
    dateSignedText: string,
  ): {
    mode: LeaseMode | 'all';
    title: string;
    detail: JSX.Element;
  }[][] => {
    return [
      [
        {
          mode: 'all',
          title: 'Lease Token',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {tokenLabelText}
            </Typography>
          ),
        },
        {
          mode: 'all',
          title: 'Lease Amount',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {rentAmountText} per month
            </Typography>
          ),
        },
      ],
      [
        {
          mode: 'all',
          title: 'Lease Length',
          detail:
            mode === 'lease' ? (
              <LeaseLengthSelect
                finalLeaseLength={finalLeaseLength}
                handleSelectChange={handleLeaseLengthSelect}
                leaseLengths={leaseLengths}
              />
            ) : (
              <Typography variant="subtitle2" className={styles.detailItem}>
                {finalLeaseLengthText} months
              </Typography>
            ),
        },
        {
          mode: 'all',
          title: 'Security Deposit Amount',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {depositText}
            </Typography>
          ),
        },
      ],
      [
        {
          mode: 'all',
          title: 'Grace Period',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {gracePeriodText} days
            </Typography>
          ),
        },
        {
          mode: 'all',
          title: 'Lease Status',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {leaseStatusText}
            </Typography>
          ),
        },
      ],
      [
        {
          mode: 'rent',
          title: 'Date Signed',
          detail: (
            <Typography variant="subtitle2" className={styles.detailItem}>
              {dateSignedText}
            </Typography>
          ),
        },
      ],
    ];
  };
  const assetDetailsRows: AssetDetailRow[][] = useMemo(() => {
    if (!lease) {
      return rows(NA, NA, [], NA, NA, NA, NA, NA);
    }
    const token = tokens.find((token) => token.symbol === lease?.rentToken);
    const tokenLabel = token ? token.label : NA;
    const tokenSymbol = token ? token.symbol : NA;
    const leaseLengths = Array(lease.maxLeaseLength - lease.minLeaseLength + 1)
      .fill(null)
      .map((_, i) => i + lease.minLeaseLength);

    const tokenLabelText = tokenLabel;
    const rentAmountText = `${lease.rentAmount} ${tokenSymbol}`;
    const depositText = `${lease.deposit} $${tokenSymbol}`;
    const finalLeaseLengthText = (lease.finalLeaseLength ?? 0).toString();
    const gracePeriodText = lease.gracePeriod.toString();
    const leaseStatusText = lease.status;
    const dateSignedText = moment(lease.dateSigned).format('YYYY-MM-DD ZZ');
    return rows(
      tokenLabelText,
      rentAmountText,
      leaseLengths,
      depositText,
      finalLeaseLengthText,
      gracePeriodText,
      leaseStatusText,
      dateSignedText,
    );
  }, [mode, lease, finalLeaseLength, handleLeaseLengthSelect]);

  return (
    <Fragment>
      {assetDetailsRows.map((row, index) => (
        <Grid key={index} container spacing={2} className={styles.modalContentRow} style={{ display: 'flex' }}>
          {row.map((column) => (
            <Fragment>
              {(column.mode === mode || column.mode === 'all') && (
                <Grid key={column.title} sm={12} md={6} item style={{ width: '100%' }}>
                  <Typography variant="body2" style={{ paddingBottom: '0.25rem' }}>
                    {column.title}
                  </Typography>
                  {column.detail}
                </Grid>
              )}
            </Fragment>
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
