import { MapContainer, Marker, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { MapsProps, MapStyles, marker, StyledPopup } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';

const useStyles = makeStyles(() => MapStyles);

const MapName = 'Somnium Space VR';

const SomniumSpaceMap = ({ assets, selected }: MapsProps) => {
  const theme = useTheme<Theme>();
  const styles = useStyles();
  const { latLangBounds, position, markerRefs, setMap } = useRenderMaps({
    bounds: {
      southwest: [-130, -130],
      northeast: [130, 130],
    },
    items: assets,
    selected,
    center: [0, 0],
  });

  return (
    <div>
      {
        <MapContainer
          center={position}
          zoom={0}
          className={styles.map}
          whenCreated={(map) => setMap(map)}
          minZoom={2}
          maxZoom={5}
          crs={L.CRS.Simple}
        >
          <ImageOverlay
            attribution={`Map data &copy; ${MapName}`}
            url="https://map.somniumspace.com/images/Somnium_Space_World_Map_HQ2.jpg"
            bounds={latLangBounds}
          />

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
      }
    </div>
  );
};

export default SomniumSpaceMap;
