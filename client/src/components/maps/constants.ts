import L from 'leaflet';
import styled from 'styled-components';
import { Popup } from 'react-leaflet';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import { Asset } from '../../store/meta-nft-collections/profileOwnershipSlice';
import { ClassKeyOfStyles, createStyles } from '@material-ui/styles';

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

export interface MapsProps {
  assets: Asset[];
  selected: number | null;
}

export const MapStyles = createStyles({
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
});
