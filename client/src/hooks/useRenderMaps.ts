import L, { Map } from 'leaflet';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Pair } from '../types/interfaces';

interface IProps {
  bounds?: {
    southwest: Pair<number, number>;
    northeast: Pair<number, number>;
  };
  items: any[];
  selected: number | null;
  center: L.LatLngExpression;
}

const useRenderMaps = ({ bounds, items, selected, center }: IProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const markerRefs = useRef<{ ref: L.Marker | null; position: L.LatLngExpression }[]>([]);
  const [position, setPosition] = useState<L.LatLngExpression>(center);
  const [latLangBounds, setLatLangBounds] = useState<L.LatLngBounds>(
    new L.LatLngBounds([
      [0, 0],
      [0, 0],
    ]),
  );

  // for tilelayers to load tiles
  const ResizeMap = () => {
    setTimeout(() => {
      map?.invalidateSize();
    }, 250);
    return null;
  };

  // for tilelayers to load tiles
  const ChangeMapView = ({ coords }) => {
    map?.setView(coords);
    return null;
  };

  useEffect(() => {
    markerRefs.current = markerRefs.current.slice(0, items.length);
  }, [items]);

  useEffect(() => {
    if (!map) return;
    map.closePopup();
    if (markerRefs && selected !== null && markerRefs.current[selected].ref) {
      const coords = markerRefs.current[selected].position;
      const popup = markerRefs.current[selected].ref?.getPopup();
      if (!popup) return;
      map.setView(new L.LatLng(coords[0], coords[1]));
      markerRefs.current[selected].ref?.openPopup();
      setPosition(coords);
      return;
    }
  }, [selected, map, markerRefs, markerRefs.current]);

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

  // position is map center
  // set map to initialize other properties e.g. bounds
  return { position, markerRefs, latLangBounds, setMap, ResizeMap, ChangeMapView };
};

export default useRenderMaps;
