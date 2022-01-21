import L from 'leaflet';
import styled from 'styled-components';
import { Popup } from 'react-leaflet';

export const marker = new L.Icon({
  iconUrl: '/marker.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
export interface PopupProps {
  readonly color: string;
}
export const StyledPopup = styled(Popup)<PopupProps>`
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
