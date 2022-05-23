import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const state = atom({
  key: 'loading-overlay',
  default: false,
});

export const useLoadingOverlay = () => {
  const set = useSetRecoilState(state);

  const open = () => set(true);
  const close = () => set(false);

  const wrap =
    <T extends any>(f: () => T) =>
    async () => {
      try {
        open();
        return await f();
      } finally {
        close();
      }
    };

  return { open, close, wrap };
};

export const LoadingOverlay = () => {
  const open = useRecoilValue(state);
  return (
    <Backdrop sx={{ color: '#fff', zIndex: 9999999999 }} open={open} transitionDuration={{ exit: 500 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
