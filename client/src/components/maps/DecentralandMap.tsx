import { MapContainer, Marker, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { MapsProps, MapStyles, marker, StyledPopup } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';

const useStyles = makeStyles(() => MapStyles);

const MapName = 'Decentraland';

const DecentralandMap = ({ assets, selected }: MapsProps) => {
  const theme = useTheme<Theme>();

  const styles = useStyles();
  const { latLangBounds, markerRefs, position, setMap } = useRenderMaps({
    bounds: {
      southwest: [-750, -750],
      northeast: [750, 750],
    },
    items: assets,
    center: [0, 0],
    selected,
  });

  return (
    <div>
      {
        <MapContainer
          center={position}
          zoom={0}
          className={styles.map}
          whenCreated={(map) => {
            setMap(map);
          }}
          minZoom={0}
          maxZoom={3}
          crs={L.CRS.Simple}
        >
          <ImageOverlay
            attribution={`Map data &copy; ${MapName}`}
            url="https://api.decentraland.org/v1/map.png?width=1500&height=1500&size=5&center=0,0"
            bounds={latLangBounds}
          />

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
        </MapContainer>
      }
    </div>
  );
};

export default DecentralandMap;
