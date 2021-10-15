import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.5);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Loading = () => (
  <div style={{ height: '100vh' }}>
    <Wrapper>
      <CircularProgress />
    </Wrapper>
  </div>
);

export default Loading;
