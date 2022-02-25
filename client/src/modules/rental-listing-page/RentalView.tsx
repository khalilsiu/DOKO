import {
  MenuItem,
  withStyles,
  makeStyles,
  Button,
  Grid,
  Typography,
  Theme,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { useEffect, useState } from 'react';
import LeaseCard from '../../components/rentalListing/LeaseCard';
import RenderMaps from '../../components/maps/RenderMaps';
import metaverses from '../../constants/metaverses';
import { Asset } from '../../store/summary/profileOwnershipSlice';
import { useHistory, useParams } from 'react-router-dom';
import LeaseDetailModal from '../../components/rentalListing/LeaseDetailModal';
import { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAssetFromServer } from '../../store/asset/assetSlice';
import { RootState } from '../../store/store';

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
const StyledButton = withStyles({
  root: {
    minWidth: '300px',
    borderWidth: '2px',
  },
})(Button);

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
  leaseCardSection: { height: '100%', overflowY: 'scroll' },
  leaseView: {
    height: '600px',
  },
  sortMenu: {
    position: 'absolute',
    right: 0,
    boxShadow: 'rgb(4 17 29 / 25%) 0px 0px 8px 0px',
    borderRadius: '10px',
    overflow: 'hidden',
    padding: '0.5rem 0 0.5rem 0',
    backgroundColor: 'white',
    width: '100%',
    zIndex: 1000,
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

const RentalView = ({
  metaverseIndex,
  handleSortChange,
  sortOpen,
  setSortOpen,
  sortIndex,
  assets,
}: IRentalView) => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const [collectionAssetSelected, setCollectionAssetSelected] = useState<Array<number | null>>(
    metaverses.map(() => null),
  );
  const asset = useSelector((state: RootState) => state.asset);
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
      dispatch(getAssetFromServer({ contractAddress: urlContractAddress, assetId: urlTokenId }));
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
            {sortOptions[sortIndex].label} <ArrowDropDownIcon />
          </StyledButton>
          {sortOpen && (
            <div className={styles.sortMenu}>
              {sortOptions.map((sort, index) => (
                <MenuItem
                  value={index}
                  onClick={() => handleSortChange(metaverseIndex, index)}
                  className={styles.menuItem}
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
      <Grid container spacing={2} className={styles.leaseView}>
        <Grid item md={4} className={styles.leaseCardSection}>
          {flatAssets.map((asset, assetIndex) => (
            <LeaseCard
              key={asset.tokenId}
              asset={asset}
              handleClick={() => onAssetClick(metaverseIndex, assetIndex)}
            />
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
      {urlContractAddress && urlTokenId && <LeaseDetailModal asset={asset} />}
    </div>
  );
};

export default RentalView;
