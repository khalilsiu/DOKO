import { lazy, PropsWithChildren, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Intro from './modules/core/Intro';
import Header from './modules/core/Header';
import Footer from './modules/core/Footer';
import { AuthContextProvider } from './contexts/AuthContext';
import { CreateProfileContextProvider } from './contexts/CreateProfileContext';
import { DrawerContextProvider } from './contexts/DrawerContext';
import { Loading } from './components/Loading';
import { MetaLanding } from './modules/meta-landing';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';
import { closeToast, ToastAction } from './store/app/appStateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { WSContextProvider } from './contexts/WSContext';
import { Button } from '@material-ui/core';

const AddressPage = lazy(() => import(/* webpackPrefetch: true */ './modules/address-page'));
const RentalListingPage = lazy(() => import(/* webpackPrefetch: true */ './modules/rental-listing-page'));
const MetaNftIndividual = lazy(() => import(/* webpackPrefetch: true */ './modules/meta-nft-individual'));
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
  const { toast } = useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch();
  const handleToastClose = () => {
    dispatch(closeToast());
  };

  const renderToastAction = (toastAction: ToastAction) => {
    switch (toastAction) {
      case 'refresh': {
        return <Button onClick={() => window.location.reload()}>Refresh</Button>;
      }
      default: {
        <></>;
      }
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <AuthContextProvider>
          <WSContextProvider>
            <CreateProfileContextProvider>
              <DrawerContextProvider intro={<Intro drawer />}>
                <Header />
                <Switch>
                  <Route path="/" exact>
                    <MetaLanding />
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
                  <Route path="/nft/:chain/:address/:id" exact>
                    <RouteContainer>
                      <MetaNftIndividual />
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
                <Snackbar open={toast.show} autoHideDuration={6000} onClose={handleToastClose}>
                  <Alert severity={toast.state} action={toast.action && renderToastAction(toast.action)}>
                    {toast.message}
                  </Alert>
                </Snackbar>
                <Footer />
              </DrawerContextProvider>
            </CreateProfileContextProvider>
          </WSContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
