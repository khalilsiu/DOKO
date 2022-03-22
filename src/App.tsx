import React from 'react';
import { lazy, PropsWithChildren, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Footer from './components/Footer';
import { AuthContextProvider } from './contexts/AuthContext';
import { CreateProfileContextProvider } from './contexts/CreateProfileContext';
import { DrawerContextProvider } from './contexts/DrawerContext';
import { Loading } from './components/Loading';
import { LandingPage } from './modules/landing-page';
import { WSContextProvider } from './contexts/WSContext';
import Header from 'components/Header';
import Intro from 'components/Intro';
import MetaStatsPage from './modules/meta-stats-page';
import { ContractContextProvider } from 'contexts/ContractContext';
import { GlobalSnackbar } from 'components/Footer/GlobalSnackbar';

const AddressPage = lazy(() => import(/* webpackPrefetch: true */ './modules/address-page'));
const RentalListingPage = lazy(() => import(/* webpackPrefetch: true */ './modules/rental-listing-page'));
const MetaIndividualLandPage = lazy(() => import(/* webpackPrefetch: true */ './modules/individual-land-page'));
const ProfilesPage = lazy(() => import(/* webpackPrefetch: true */ './modules/profiles-page'));
const ProfilePage = lazy(() => import(/* webpackPrefetch: true */ './modules/profile-page'));

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

const RouteContainer = ({ children }: PropsWithChildren<any>) => {
  const styles = useStyles();
  return <div className={styles.offset}>{children}</div>;
};

const App = React.memo(() => {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <AuthContextProvider>
          <ContractContextProvider>
            <WSContextProvider>
              <CreateProfileContextProvider>
                <DrawerContextProvider intro={<Intro drawer />}>
                  <Header />
                  <Switch>
                    <Route path="/" exact>
                      <LandingPage />
                    </Route>
                    <Route path="/address/:address" exact>
                      <RouteContainer>
                        <AddressPage />
                      </RouteContainer>
                    </Route>
                    <Route path="/address/:address/:contractAddress/:tokenId/lease" exact>
                      <RouteContainer>
                        <AddressPage />
                      </RouteContainer>
                    </Route>
                    <Route path="/rentals" exact>
                      <RouteContainer>
                        <RentalListingPage />
                      </RouteContainer>
                    </Route>
                    <Route path="/rentals/:contractAddress/:tokenId/lease" exact>
                      <RouteContainer>
                        <RentalListingPage />
                      </RouteContainer>
                    </Route>
                    <Route path="/asset/:address/:id" exact>
                      <RouteContainer>
                        <MetaIndividualLandPage />
                      </RouteContainer>
                    </Route>
                    <Route path="/profiles" exact>
                      <RouteContainer>
                        <ProfilesPage />
                      </RouteContainer>
                    </Route>
                    <Route path="/profiles/:hash" exact>
                      <RouteContainer>
                        <ProfilePage />
                      </RouteContainer>
                    </Route>
                    <Route path="/dcl-stats" exact>
                      <RouteContainer>
                        <MetaStatsPage />
                      </RouteContainer>
                    </Route>
                  </Switch>
                  <Footer />
                  <GlobalSnackbar />
                </DrawerContextProvider>
              </CreateProfileContextProvider>
            </WSContextProvider>
          </ContractContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </Suspense>
  );
});

export default App;
