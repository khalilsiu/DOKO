import { MapContainer, Marker, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { MapsProps, MapStyles, marker, StyledPopup } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';

const useStyles = makeStyles(() => MapStyles);

const MapName = 'The Sandbox';

const SandboxMap = ({ assets, selected }: MapsProps) => {
  const theme = useTheme<Theme>();

  const styles = useStyles();
  const { latLangBounds, markerRefs, position, setMap } = useRenderMaps({
    bounds: {
      southwest: [-350, -350],
      northeast: [350, 350],
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
          minZoom={0}
          maxZoom={5}
          crs={L.CRS.Simple}
        >
          <ImageOverlay
            attribution={`Map data &copy; ${MapName}`}
            url="/blank_map3.png"
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

export default SandboxMap;
