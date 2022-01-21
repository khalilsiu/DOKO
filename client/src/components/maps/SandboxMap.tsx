import { MapContainer, Marker, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { Asset } from '../../store/meta-nft-collections/profileOwnershipSlice';
import { marker, StyledPopup } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';

const useStyles = makeStyles(() => ({
  map: {
    height: 600,
    width: '100%',
    border: '3px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box',
    borderRadius: '15px',
  },
  popupTitleContainer: {
    borderBottom: 'solid white 1px',
    padding: '10px 16px',
    fontWeight: 'bold',
    width: '300px',
    height: '20%',
  },
  popupContentContainer: {
    height: '80%',
    padding: '10px 16px',
  },
  popupContent: {
    width: 'auto',
    height: '100%',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: '6px',
  },
}));

interface MapsProps {
  assets: Asset[];
  selected: number | null;
}
const MapName = 'The Sandbox';

const SandboxMap = ({ assets, selected }: MapsProps) => {
  const theme = useTheme<Theme>();
  const refs: { ref: L.Popup | null; position: L.LatLngExpression }[] = [];
  const styles = useStyles();
  const { latLangBounds, position, setMap, ResizeMap, ChangeMapView } = useRenderMaps({
    refs,
    selected,
    initialPosition: [0, 0],
    bounds: {
      southwest: [-350, -350],
      northeast: [350, 350],
    },
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

          <ResizeMap />
          <ChangeMapView coords={position} />
          {assets.map((asset) => {
            return (
              <Marker icon={marker} position={asset.coordinates}>
                <StyledPopup
                  color={theme.palette.secondary.main}
                  ref={(r) => refs.push({ ref: r || null, position: asset.coordinates })}
                >
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
