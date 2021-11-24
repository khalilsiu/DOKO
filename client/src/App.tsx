import { useEffect, useState, lazy, PropsWithChildren, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Intro from './modules/core/Intro';
import Header from './modules/core/Header';
import Footer from './modules/core/Footer';

import { AuthContextProvider } from './contexts/AuthContext';
import { DrawerContextProvider } from './contexts/DrawerContext';
import { Loading } from './components/Loading';
import { Landing } from './modules/landing';
import { MetaLanding } from './modules/meta-landing';

const NftCollections = lazy(() => import(/* webpackPrefetch: true */ './modules/nft-collections'));
const NftIndividual = lazy(() => import(/* webpackPrefetch: true */ './modules/nft-individual'));
const Collection = lazy(() => import(/* webpackPrefetch: true */ './modules/collection'));
const Profiles = lazy(() => import(/* webpackPrefetch: true */ './modules/profiles'));
const ProfilePage = lazy(() => import(/* webpackPrefetch: true */ './modules/profile-page'));

const MetaNftCollections = lazy(() => import(/* webpackPrefetch: true */ './modules/meta-nft-collections'));
const MetaNftIndividual = lazy(() => import(/* webpackPrefetch: true */ './modules/meta-nft-individual'));
const MetaCollection = lazy(() => import(/* webpackPrefetch: true */ './modules/meta-collection'));
const MetaProfiles = lazy(() => import(/* webpackPrefetch: true */ './modules/meta-profiles'));
const MetaProfilePage = lazy(() => import(/* webpackPrefetch: true */ './modules/meta-profile-page'));

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

const RouteContainer = ({ children }: PropsWithChildren<any>) => {
  const styles = useStyles();
  return <div className={styles.offset}>{children}</div>;
};

function App() {
  const [subdomain, setSubDomain] = useState('');
  useEffect(() => {
    const { host } = window.location;
    const arr = host
      .split('.');
    if (arr.length > 0 && host.indexOf('staging') !== -1) {
      console.log(arr[1]);
      setSubDomain(arr[1]);
    } else if (arr.length > 0) {
      setSubDomain(arr[0]);
      console.log(arr[0]);
    }
  }, []);
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <AuthContextProvider>
          <DrawerContextProvider intro={<Intro drawer />}>
            <Header />
            <Switch>
              <Route path="/" exact>
                <MetaLanding />
              </Route>
              <Route path="/address/:address" exact>
                <RouteContainer>
                  <MetaNftCollections />
                </RouteContainer>
              </Route>
              <Route path="/nft/:chain/:address/:id" exact>
                <RouteContainer>
                  <MetaNftIndividual />
                </RouteContainer>
              </Route>
              <Route path="/collections/:address" exact>
                <RouteContainer>
                  <MetaCollection />
                </RouteContainer>
              </Route>
              <Route path="/profiles" exact>
                <RouteContainer>
                  <MetaProfiles />
                </RouteContainer>
              </Route>
              <Route path="/profiles/:hash" exact>
                <RouteContainer>
                  <MetaProfilePage />
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
