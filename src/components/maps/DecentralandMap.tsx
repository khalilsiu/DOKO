import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { MapsProps, MapStyles, StyleProps } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';
import RenderMarkers from './RenderMarkers';
import { memo } from 'react';

const useStyles = makeStyles<Theme, StyleProps>(() => MapStyles);

const MapName = 'Decentraland';

const DecentralandMap = ({ selected, assets }: MapsProps) => {
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const styles = useStyles({ smOrAbove });
  const { latLangBounds, markerRefs, position, setMap, ResizeMap } = useRenderMaps({
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
          <ResizeMap />
          <RenderMarkers markerRefs={markerRefs} assets={assets} />
        </MapContainer>
      }
    </div>
  );
};

export default memo(DecentralandMap);
