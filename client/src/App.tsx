import { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import Intro from './modules/core/Intro';
import { Header } from './modules/core/Header';
import { Landing } from './modules/landing';
import { Footer } from './modules/core/Footer';
import { AuthContextProvider } from './contexts/AuthContext';
import { DrawerContextProvider } from './contexts/DrawerContext';
import { Loading } from './components/Loading';

const NftCollections = lazy(() => import('./modules/nft-collections'));
const NftIndividual = lazy(() => import('./modules/nft-individual'));
const Collection = lazy(() => import('./modules/collection'));

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

function App() {
  const styles = useStyles();

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <DrawerContextProvider intro={<Intro drawer />}>
          <Header />
          <Switch>
            <Suspense fallback={<Loading />}>
              <Route path="/" exact>
                <Landing />
              </Route>
              <Route path="/address/:address" exact>
                <div className={styles.offset}>
                  <NftCollections />
                </div>
              </Route>
              <Route path="/nft/:address/:id" exact>
                <div className={styles.offset}>
                  <NftIndividual />
                </div>
              </Route>
              <Route path="/collections/:address" exact>
                <div className={styles.offset}>
                  <Collection />
                </div>
              </Route>
            </Suspense>
          </Switch>
          <Footer />
        </DrawerContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
