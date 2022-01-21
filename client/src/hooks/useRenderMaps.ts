import L, { Map } from 'leaflet';
import { useEffect } from 'react';
import { useState } from 'react';
import { Pair } from '../types/interfaces';

interface IProps {
  bounds?: {
    southwest: Pair<number, number>;
    northeast: Pair<number, number>;
  };
}

const useRenderMaps = ({ bounds }: IProps) => {
  const [map, setMap] = useState<Map | null>(null);
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
  const ChangeMapView = ({ coords }) => {
    map?.setView(coords);
    return null;
  };

  useEffect(() => {
    if (map && bounds) {
      const newBounds = new L.LatLngBounds(
        map.unproject(bounds.southwest, 0),
        map.unproject(bounds.northeast, 0),
      );
      setLatLangBounds(newBounds);
      map.setMaxBounds(newBounds);
    }
  }, [map]);

  return { map, latLangBounds, setMap, ResizeMap, ChangeMapView };
};

export default useRenderMaps;
