import { Snackbar } from '@mui/material';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import CloseIcon from '@mui/icons-material/Close';

const state = atom({
  key: 'not-implemented-snack-bar',
  default: false,
});

export const useNotifyNotImplemented = () => {
  const set = useSetRecoilState(state);
  return () => set(true);
};

export const NotImplementedSnackbar = () => {
  const [open, setOpen] = useRecoilState(state);
  return (
    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      autoHideDuration={1000}
      onClose={() => setOpen(false)}
      message="not implemented."
      action={<CloseIcon onClick={() => setOpen(false)} style={{ cursor: 'pointer' }} />}
    />
  );
};
