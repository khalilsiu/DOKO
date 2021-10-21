import { lazy, PropsWithChildren, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Intro from './modules/core/Intro';
import Header from './modules/core/Header';
import Footer from './modules/core/Footer';

import { AuthContextProvider } from './contexts/AuthContext';
import { DrawerContextProvider } from './contexts/DrawerContext';
import { Loading } from './components/Loading';
import { Landing } from './modules/landing';

const NftCollections = lazy(() => import(/* webpackPrefetch: true */ './modules/nft-collections'));
const NftIndividual = lazy(() => import(/* webpackPrefetch: true */ './modules/nft-individual'));
const Collection = lazy(() => import(/* webpackPrefetch: true */ './modules/collection'));

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

const RouteContainer = ({ children }: PropsWithChildren<any>) => {
  const styles = useStyles();
  return <div className={styles.offset}>{children}</div>;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <AuthContextProvider>
          <DrawerContextProvider intro={<Intro drawer />}>
            <Header />
            <Switch>
              <Route path="/" exact>
                <Landing />
              </Route>
              <Route path="/address/:address" exact>
                <RouteContainer>
                  <NftCollections />
                </RouteContainer>
              </Route>
              <Route path="/nft/:chain/:address/:id" exact>
                <RouteContainer>
                  <NftIndividual />
                </RouteContainer>
              </Route>
              <Route path="/collections/:address" exact>
                <RouteContainer>
                  <Collection />
                </RouteContainer>
              </Route>
            </Switch>
            <Footer />
          </DrawerContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
