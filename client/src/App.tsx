import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Header } from './modules/core/Header';
import { NftCollections } from './modules/nft-collections';
import { Landing } from './modules/landing';
import { Footer } from './modules/core/Footer';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/collections/:address" exact>
          <NftCollections />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
