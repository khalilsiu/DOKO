import styled from "styled-components";

interface Props {
  onLogin: () => void;
  address: string;
}

const Content = styled.div`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ececec;
  cursor: pointer;
`;

export const HeaderUserButton = ({ onLogin = () => null, address }: Props) => {
  return <Content>{address ? "Connect" : address}</Content>;
};
