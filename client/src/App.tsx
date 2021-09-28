import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Header } from './modules/core/Header';
import { NftCollections } from './modules/nft-collections';
import {NftIndividual} from './modules/nft-individual';
import { Landing } from './modules/landing';
import { Footer } from './modules/core/Footer';
import { AuthContextProvider } from './contexts/AuthContext';
import { makeStyles } from '@material-ui/core';
import { DrawerContextProvider } from './contexts/DrawerContext';

function App() {
  const styles = useStyles();

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <DrawerContextProvider>
          <Header />
          <Switch>
            <Route path="/" exact>
              <Landing />
            </Route>
            <Route path="/collections/:address" exact>
              <div className={styles.offset}>
                <NftCollections />
              </div>
            </Route>
             <Route path="/nft/:address/:id" exact>
              <div className={styles.offset}>
                <NftIndividual />
              </div>
            </Route>
          </Switch>
          <Footer />
        </DrawerContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

const useStyles = makeStyles(theme => ({
  offset: theme.mixins.toolbar
}));

export default App;
