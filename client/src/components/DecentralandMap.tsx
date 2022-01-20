import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression, Map } from 'leaflet';
import { makeStyles, Theme, useTheme } from '@material-ui/core';
import { useState } from 'react';
import styled from 'styled-components';
import { Asset } from '../store/meta-nft-collections/profileOwnershipSlice';
import { getCoordinatesFromUrl } from '../utils/utils';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
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

interface RenderMapsProps {
  metaverseName: string;
  assets: Asset[];
  position: L.LatLngExpression;
}

const marker = new L.Icon({
  iconUrl: '/marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
interface PopupProps {
  readonly color: string;
}
const StyledPopup = styled(Popup)<PopupProps>`
  .leaflet-popup-content-wrapper {
    background-color: black;
    border: white 1px solid;
    color: ${(props) => props.color};
  }
  .leaflet-popup-content {
    height: 200px;
    margin: 0;
  }
  .leaflet-popup-tip {
    background-color: black;
    border: white 1px solid;
  }
`;

const DecentralandMap = ({ metaverseName, assets, position }: RenderMapsProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const theme = useTheme<Theme>();
  const refs: Array<L.Popup | null> = [];
  const styles = useStyles();
  const [latLangBounds, setLatLangBounds] = useState<L.LatLngBounds>(
    new L.LatLngBounds([
      [0, 0],
      [0, 0],
    ]),
  );

  const ResizeMap = () => {
    setTimeout(() => {
      map?.invalidateSize();
    }, 250);
    return null;
  };
  function ChangeMapView({ coords }) {
    map?.setView(coords, 8);
    return null;
  }

  useEffect(() => {
    if (map) {
      setLatLangBounds(
        new L.LatLngBounds(map.unproject([-750, -750], 0), map.unproject([750, 750], 0)),
      );
    }
  }, [map]);

  return (
    <div>
      {
        <MapContainer
          center={[0, 0]}
          zoom={0}
          className={styles.map}
          whenCreated={(map) => setMap(map)}
          minZoom={0}
          maxZoom={10}
          crs={L.CRS.Simple}
          maxBounds={latLangBounds}
        >
          <ImageOverlay
            attribution="Map data &copy; Decentraland"
            url="https://api.decentraland.org/v1/map.png?width=1500&height=1500&size=5&center=0,0"
            bounds={latLangBounds}
          />

          <ResizeMap />
          <ChangeMapView coords={position} />
          {assets.map((asset) => {
            const markerPosition = getCoordinatesFromUrl(metaverseName, asset.imageOriginalUrl);
            console.log(asset.imageOriginalUrl);
            console.log(markerPosition);
            return (
              <Marker icon={marker} position={markerPosition}>
                <StyledPopup color={theme.palette.secondary.main} ref={(r) => refs.push(r || null)}>
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
