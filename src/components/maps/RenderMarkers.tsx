import { makeStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core';

import { memo } from 'react';
import { Marker } from 'react-leaflet';
import { Asset } from '../../store/profile/profileOwnershipSlice';
import { StyleProps, marker, MapStyles, StyledPopup } from './constants';
const useStyles = makeStyles<Theme, StyleProps>(() => MapStyles);

interface IProps {
  assets: Asset[];
  markerRefs: React.MutableRefObject<
    {
      ref: L.Marker<any> | null;
      position: L.LatLngExpression;
    }[]
  >;
}
const RenderMarkers = memo(({ assets, markerRefs }: IProps) => {
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const theme = useTheme<Theme>();
  const styles = useStyles({ smOrAbove });
  return (
    <>
      {assets.map((asset, i) => {
        return (
          <Marker
            key={asset.id}
            icon={marker}
            position={asset.coordinates}
            ref={(r) => (markerRefs.current[i] = { ref: r, position: asset.coordinates })}
          >
            <StyledPopup color={theme.palette.secondary.main}>
              <div className={styles.popupTitleContainer}>{asset.name}</div>
              <div className={styles.popupContentContainer}>
                <a href={`/nft/eth/${asset.assetContract.address}/${asset.tokenId}`}>
                  <div
                    className={styles.popupContent}
                    style={{
                      backgroundImage: `url('${asset.imageUrl}')`,
                    }}
                  ></div>
                </a>
              </div>
            </StyledPopup>
          </Marker>
        );
      })}
    </>
  );
});

export default RenderMarkers;
