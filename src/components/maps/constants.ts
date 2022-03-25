import L from 'leaflet';
import styled from 'styled-components';
import { Popup } from 'react-leaflet';
import { createStyles } from '@material-ui/styles';
import MarkerImage from 'assets/app/marker.png';
import { Asset } from 'store/profile/profileOwnershipSlice';

export const marker = new L.Icon({
  iconUrl: MarkerImage,
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
    width: 250px;
  }
  .leaflet-popup-content {
    height: 150px;
    margin: 0;
  }
  .leaflet-popup-tip {
    background-color: black;
    border: white 1px solid;
  }
`;

export interface MapsProps {
  selected: number | null;
  assets: Asset[];
}

export interface StyleProps {
  smOrAbove: boolean;
}

export const MapStyles = createStyles<any, StyleProps>({
  map: {
    height: ({ smOrAbove }) => (smOrAbove ? 600 : 300),
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderRadius: '10px',
  },
  popupTitleContainer: {
    borderBottom: 'solid white 1px',
    padding: '10px 16px',
    fontWeight: 'bold',
    width: '100%',
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
});
