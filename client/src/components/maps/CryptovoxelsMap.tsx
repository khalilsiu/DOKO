import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { MapsProps, MapStyles, marker, StyledPopup } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';

const useStyles = makeStyles(() => MapStyles);

const MapName = 'Cryptovoxels';

const CryptovoxelsMap = ({ assets, selected }: MapsProps) => {
  const theme = useTheme<Theme>();

  const styles = useStyles();
  const { position, markerRefs, setMap, ResizeMap, ChangeMapView } = useRenderMaps({
    items: assets,
    selected,
    center: [0, 0],
  });

  return (
    <div>
      <MapContainer
        center={position}
        zoom={8}
        className={styles.map}
        whenCreated={(map) => setMap(map)}
      >
        <TileLayer
          attribution={`Map data &copy; ${MapName}`}
          url="https://map.cryptovoxels.com/tile?z={z}&x={x}&y={y}"
        />
        <ResizeMap />
        <ChangeMapView coords={position} />
        {assets.map((asset, i) => {
          return (
            <Marker
              icon={marker}
              position={asset.coordinates}
              ref={(r) => (markerRefs.current[i] = { ref: r, position: asset.coordinates })}
              key={asset.id}
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
      </MapContainer>
    </div>
  );
};

export default CryptovoxelsMap;
