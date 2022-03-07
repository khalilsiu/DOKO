import {
  MenuItem,
  withStyles,
  makeStyles,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  Theme,
  useTheme,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { forwardRef, useEffect, useState } from 'react';
import LeaseCard from '../../components/rentalListing/LeaseCard';
import RenderMaps from '../../components/maps/RenderMaps';
import metaverses from '../../constants/metaverses';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import { useParams } from 'react-router-dom';
import LeaseDetailModal from '../../components/rentalListing/LeaseDetailModal';
import { useDispatch } from 'react-redux';
import { getAssetFromServer, useAssetSliceSelector } from '../../store/asset/assetSlice';
import { useMetaMask } from 'metamask-react';

export const sortOptions = [
  {
    label: 'Newest',
    value: {
      field: 'created_at',
      order: 'desc',
    },
  },
  {
    label: 'Oldest',
    value: {
      field: 'created_at',
      order: 'asc',
    },
  },
  {
    label: 'Rent: Low to High',
    value: {
      field: 'rent_amount',
      order: 'asc',
    },
  },
  {
    label: 'Rent: High to Low',
    value: {
      field: 'rent_amount',
      order: 'desc',
    },
  },
  {
    label: 'Deposit: Low to High',
    value: {
      field: 'deposit',
      order: 'asc',
    },
  },
  {
    label: 'Deposit: High to Low',
    value: {
      field: 'deposit',
      order: 'desc',
    },
  },
  {
    label: 'Min Lease Length: Short to Long',
    value: {
      field: 'min_lease_length',
      order: 'asc',
    },
  },
  {
    label: 'Min Lease Length: Long to Short',
    value: {
      field: 'min_lease_length',
      order: 'desc',
    },
  },
  {
    label: 'Max Lease Length: Short to Long',
    value: {
      field: 'max_lease_length',
      order: 'asc',
    },
  },
  {
    label: 'Max Lease Length: Long to Short',
    value: {
      field: 'max_lease_length',
      order: 'desc',
    },
  },
];
const StyledButton = withStyles((theme: Theme) => ({
  root: {
    minWidth: '300px',
    borderWidth: '2px',
    [theme.breakpoints.down('md')]: {
      minWidth: '100px',
    },
  },
}))(Button);

const useStyles = makeStyles((theme: Theme) => ({
  underline: {
    '&:before': {
      borderBottom: 'none',
    },
    '&:after': {
      borderBottom: 'none',
    },
    '&:focus': {
      borderBottom: 'none',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: 'none',
    },
  },
  menuItem: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#EBEBEB',
    },
  },
  resultsText: {
    color: theme.palette.grey[500],
    fontSize: '0.8rem',
    fontStyle: 'italic',
    marginBottom: '0.4rem',
  },
  leaseCardSection: {
    height: '100%',
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      overflowX: 'scroll',
    },
  },
  leaseView: {},
  sortMenu: {
    position: 'absolute',
    right: 0,
    boxShadow: 'rgb(4 17 29 / 25%) 0px 0px 8px 0px',
    borderRadius: '10px',
    overflow: 'hidden',
    padding: '0.5rem 0 0.5rem 0',
    backgroundColor: 'white',
    minWidth: 'content-fit',
    zIndex: 10000,
  },
}));

interface IRentalView {
  metaverseIndex: number;
  handleSortChange: (metaverseIndex: number, sortItemIndex: number) => void;
  sortOpen: boolean;
  setSortOpen: (sortState: boolean) => void;
  sortIndex: number;
  assets?: Asset[][];
}

const RentalView = forwardRef<HTMLDivElement, IRentalView>(
  (
    { metaverseIndex, handleSortChange, sortOpen, setSortOpen, sortIndex, assets }: IRentalView,
    ref,
  ) => {
    const styles = useStyles();
    const dispatch = useDispatch();
    const [collectionAssetSelected, setCollectionAssetSelected] = useState<Array<number | null>>(
      metaverses.map(() => null),
    );
    const { account: walletAddress } = useMetaMask();
    const theme = useTheme();
    const mdOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const asset = useAssetSliceSelector((state) => state);
    const { contractAddress: urlContractAddress, tokenId: urlTokenId } =
      useParams<{ contractAddress: string; tokenId: string }>();

    // subcontract assets
    const flatAssets = assets ? assets.flat() : [];

    const onAssetClick = (collectionIndex: number, index: number) => {
      const copy = collectionAssetSelected.slice();
      copy[collectionIndex] = index;
      setCollectionAssetSelected(copy);
    };

    useEffect(() => {
      if (urlContractAddress && urlTokenId) {
        dispatch(getAssetFromServer({ contractAddress: urlContractAddress, tokenId: urlTokenId }));
      }
    }, [urlContractAddress, urlTokenId]);

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <StyledButton
              className="gradient-button"
              disabled={false}
              variant="outlined"
              onClick={() => setSortOpen(!sortOpen)}
              style={{}}
            >
              {mdOrAbove && sortOptions[sortIndex].label}
              <ArrowDropDownIcon />
            </StyledButton>
            {sortOpen && (
              <div className={styles.sortMenu} ref={ref}>
                {sortOptions.map((sort, index) => (
                  <MenuItem
                    value={index}
                    onClick={() => handleSortChange(metaverseIndex, index)}
                    className={styles.menuItem}
                    style={sortIndex === index ? { backgroundColor: theme.palette.grey[300] } : {}}
                    key={sort.label}
                  >
                    {sort.label}
                  </MenuItem>
                ))}
              </div>
            )}
          </div>
        </div>
        <Typography variant="subtitle2" className={styles.resultsText}>
          Results showing: {flatAssets.length} listings
        </Typography>
        <Grid container spacing={2} direction={mdOrAbove ? 'row' : 'column-reverse'}>
          <Grid item md={4} className={styles.leaseCardSection}>
            {flatAssets.map((asset, assetIndex) => (
              <div>
                <LeaseCard
                  asset={asset}
                  handleClick={() => onAssetClick(metaverseIndex, assetIndex)}
                />
              </div>
            ))}
          </Grid>
          <Grid item md={8}>
            <RenderMaps
              metaverseName={metaverses[metaverseIndex].label}
              assets={flatAssets}
              assetsSelected={collectionAssetSelected}
            />
          </Grid>
        </Grid>

        {urlContractAddress && urlTokenId && walletAddress && (
          <LeaseDetailModal asset={asset} walletAddress={walletAddress} />
        )}
      </div>
    );
  },
);

export default RentalView;
