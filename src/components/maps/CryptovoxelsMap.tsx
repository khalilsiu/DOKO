import { MapContainer, TileLayer } from 'react-leaflet';
import { makeStyles, Theme, useMediaQuery } from '@material-ui/core';
import { MapsProps, MapStyles, StyleProps } from './constants';
import useRenderMaps from '../../hooks/useRenderMaps';
import RenderAssets from './RenderMarkers';
import { memo } from 'react';

const useStyles = makeStyles<Theme, StyleProps>(() => MapStyles);

const MapName = 'Cryptovoxels';

const CryptovoxelsMap = ({ selected, assets }: MapsProps) => {
  const smOrAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const styles = useStyles({ smOrAbove });
  const { position, markerRefs, setMap, ResizeMap, ChangeMapView } = useRenderMaps({
    items: assets,
    selected,
    center: [0, 0],
  });

  return (
    <div>
      <MapContainer center={position} zoom={8} className={styles.map} whenCreated={(map) => setMap(map)}>
        <TileLayer
          attribution={`Map data &copy; ${MapName}`}
          url="https://map.cryptovoxels.com/tile?z={z}&x={x}&y={y}"
        />
        <ResizeMap />
        <ChangeMapView coords={position} />
        <RenderAssets markerRefs={markerRefs} assets={assets} />
      </MapContainer>
    </div>
  );
};

export default memo(CryptovoxelsMap);
