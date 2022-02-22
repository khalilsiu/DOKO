import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { MapsProps, MapStyles, StyleProps } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';
import RenderAssets from './RenderMarkers';

const useStyles = makeStyles<Theme, StyleProps>(() => MapStyles);

const MapName = 'The Sandbox';

const SandboxMap = ({ selected, assets }: MapsProps) => {
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const styles = useStyles({ smOrAbove });
  const { latLangBounds, markerRefs, position, setMap, ResizeMap } = useRenderMaps({
    bounds: {
      southwest: [-204, -204],
      northeast: [203, 203],
    },
    items: assets,
    selected,
    center: [0, 0],
  });

  return (
    <div>
      {
        <MapContainer
          bounds={latLangBounds}
          center={position}
          zoom={2}
          className={styles.map}
          whenCreated={(map) => setMap(map)}
          minZoom={2}
          maxZoom={5}
          crs={L.CRS.Simple}
        >
          <ImageOverlay
            attribution={`Map data &copy; ${MapName}`}
            url="/sandbox_map.png"
            bounds={latLangBounds}
          />
          <ResizeMap />
          <RenderAssets markerRefs={markerRefs} assets={assets} />
        </MapContainer>
      }
    </div>
  );
};

export default SandboxMap;
