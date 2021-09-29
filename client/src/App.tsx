import { lazy, Suspense } from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import { Header } from './modules/core/Header';
import { Landing } from './modules/landing';
import { Footer } from './modules/core/Footer';
import { AuthContextProvider } from './contexts/AuthContext';
import { DrawerContextProvider } from './contexts/DrawerContext';
import { Loading } from './components/Loading';

const NftCollections = lazy(() => import('./modules/nft-collections'));
const NftIndividual = lazy(() => import('./modules/nft-individual'));

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

function App() {
  const styles = useStyles();

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <DrawerContextProvider>
          <Header />
          <Switch>
            <Suspense fallback={<Loading />}>
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
            </Suspense>
          </Switch>
          <Footer />
        </DrawerContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
