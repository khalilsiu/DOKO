import L, { Map } from 'leaflet';
import { useEffect } from 'react';
import { useState } from 'react';
import { Pair } from '../types/interfaces';

interface IProps {
  refs: { ref: L.Popup | null; position: L.LatLngExpression }[];
  selected: number | null;
  initialPosition: L.LatLngExpression;
  bounds?: {
    southwest: Pair<number, number>;
    northeast: Pair<number, number>;
  };
}

const useRenderMaps = ({ selected, initialPosition, bounds }: IProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const [position, setPosition] = useState<L.LatLngExpression>(initialPosition);
  const [refs, setRefs] = useState<{ ref: L.Popup | null; position: L.LatLngExpression }[]>([]);
  const [latLangBounds, setLatLangBounds] = useState<L.LatLngBounds>(
    new L.LatLngBounds([
      [0, 0],
      [0, 0],
    ]),
  );
  console.log('refs', refs);

  const ResizeMap = () => {
    console.log('MAPPP', map);
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
    if (!map) return;
    map.closePopup();
    if (refs && selected !== null && refs[selected] && refs[selected].ref) {
      const coords = refs[selected].position;
      map.setView(coords);
      refs[selected].ref?.openOn(map);
      setPosition(coords);
      return;
    }
  }, [selected, map, refs]);

  useEffect(() => {
    map?.on('load', () => console.log('loaded'));
    if (map && bounds) {
      const newBounds = new L.LatLngBounds(
        map.unproject(bounds.southwest, 0),
        map.unproject(bounds.northeast, 0),
      );
      setLatLangBounds(newBounds);
      map.setMaxBounds(newBounds);
    }
  }, [map]);

  return { map, setRefs, latLangBounds, position, setMap, ResizeMap, ChangeMapView };
};

export default useRenderMaps;
