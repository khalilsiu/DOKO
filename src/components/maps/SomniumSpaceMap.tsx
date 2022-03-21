import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { MapsProps, MapStyles, StyleProps } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';
import RenderAssets from './RenderMarkers';
import { memo } from 'react';

const useStyles = makeStyles<Theme, StyleProps>(() => MapStyles);

const MapName = 'Somnium Space VR';

const SomniumSpaceMap = ({ selected, assets }: MapsProps) => {
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const styles = useStyles({ smOrAbove });
  const { latLangBounds, position, markerRefs, setMap, ResizeMap } = useRenderMaps({
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
          zoom={2}
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
          <RenderAssets markerRefs={markerRefs} assets={assets} />
        </MapContainer>
      }
    </div>
  );
};

export default memo(SomniumSpaceMap);
