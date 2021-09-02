import { Button, Container } from '@material-ui/core';
import './index.scss';

export const Landing = () => {
  return (
    <Container maxWidth="lg">
      <section className="landing-top-section">
        <h1>All Your NFTs in One Place</h1>
        <h3>
          View your NFT collection for any Ethereum, BSC and Polygon address under one single
          dashboard
        </h3>
        <Button style={{ marginTop: 24 }} className="gradient-button" variant="outlined">
          Connect Metamask
        </Button>
      </section>
    </Container>
  );
};
