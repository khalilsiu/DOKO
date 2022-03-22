import React from 'react';
import { Alert } from '@material-ui/lab';
import { Button, Snackbar } from '@material-ui/core';
import { ToastAction, closeToast } from 'store/app/appStateSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/store';
import { ThirdPartyURL } from 'constants/ThirdPartyURL';

export const GlobalSnackbar = React.memo(() => {
  const dispatch = useDispatch();
  const { toast } = useSelector((state: RootState) => state.appState);

  const onRefresh = React.useCallback(() => {
    window.location.reload();
  }, []);

  const downloadMetamask = React.useCallback(() => {
    window.open(ThirdPartyURL.downloadMetamask());
  }, []);

  const renderToastAction = React.useCallback(
    (toastAction: ToastAction) => {
      switch (toastAction) {
        case 'refresh':
          return <Button onClick={onRefresh}>Refresh</Button>;
        case 'install-metamask':
          return <Button onClick={downloadMetamask}>Install Now</Button>;
        default:
          return <React.Fragment />;
      }
    },
    [onRefresh, downloadMetamask],
  );

  const handleToastClose = React.useCallback(() => {
    dispatch(closeToast());
  }, [dispatch, closeToast]);

  return (
    <Snackbar open={toast.show} autoHideDuration={6000} onClose={handleToastClose}>
      <Alert severity={toast.state} action={toast.action && renderToastAction(toast.action)}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
});
