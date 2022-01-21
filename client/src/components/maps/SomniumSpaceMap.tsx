import { MapContainer, Marker, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { Asset } from '../../store/meta-nft-collections/profileOwnershipSlice';
import { marker, StyledPopup } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';
import { useState, useRef, useEffect } from 'react';

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
const MapName = 'Somnium Space VR';

const SomniumSpaceMap = ({ assets, selected }: MapsProps) => {
  const theme = useTheme<Theme>();
  const [position, setPosition] = useState<L.LatLngExpression>([0, 0]);
  const refs = useRef<{ ref: L.Marker | null; position: L.LatLngExpression }[]>([]);
  const styles = useStyles();
  const { latLangBounds, map, setMap, ResizeMap, ChangeMapView } = useRenderMaps({
    bounds: {
      southwest: [-130, -130],
      northeast: [130, 130],
    },
  });

  useEffect(() => {
    refs.current = refs.current.slice(0, assets.length);
  }, [assets]);

  useEffect(() => {
    if (!map) return;
    map.closePopup();
    if (refs && selected !== null && refs.current[selected].ref) {
      const coords = refs.current[selected].position;
      map.flyTo(new L.LatLng(coords[0], coords[1]));
      refs.current[selected].ref?.openPopup();
      setPosition(coords);
      return;
    }
  }, [selected, map, refs, refs.current]);

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

          <ResizeMap />
          <ChangeMapView coords={position} />
          {assets.map((asset, i) => {
            return (
              <Marker
                icon={marker}
                position={asset.coordinates}
                ref={(r) => (refs.current[i] = { ref: r, position: asset.coordinates })}
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
