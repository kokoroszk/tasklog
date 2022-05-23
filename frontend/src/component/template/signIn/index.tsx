import { useState } from 'react';

import styles from './index.module.scss';

import { TextInput } from 'component/atom/input';
import { Button } from 'component/atom/button';
import { styler } from 'component/util/styler';
import { MyTooltip } from 'component/util/my-tooltip';
import { preventDuplicateExec } from 'utils/prevent-duplicate-execution';
import { useSignInFunction } from 'usecase/account/sign-in';
import { useLoadingOverlay } from 'component/util/loading-overlay';

const useSignInForm = () => {
  const [values, setValues] = useState({
    id: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    id: undefined as string | undefined,
    password: undefined as string | undefined,
    submit: undefined as string | undefined,
  });

  const updateValues = (v: Partial<typeof values>) =>
    setValues({
      ...values,
      ...v,
    });

  const updateErrors = (v: Partial<typeof errors>) =>
    setErrors({
      ...errors,
      ...v,
    });

  const signIn = useSignInFunction();

  const submit = preventDuplicateExec(async () => {
    const { id, password } = values;
    const idError = !id ? 'id is required.' : undefined;
    const pswdError = !password ? 'password is required.' : undefined;

    if (idError || pswdError) {
      updateErrors({
        id: idError,
        password: pswdError,
      });
      return;
    }

    if (await signIn(id, password)) return;
    updateErrors({ id: '', password: '', submit: 'Sign-in failed.' });
  });

  const loading = useLoadingOverlay();
  const submit_ = loading.wrap(submit);

  return {
    values,
    errors,
    submit: submit_,
    updateValues,
    updateErrors,
  };
};

interface InputProps {
  label: string;
  value: string;
  error: string | undefined;
  updateFunction: (v: string) => void;
}

const Input = (props: InputProps) => {
  const wrapper = styler(styles.input);
  if (props.error !== undefined) wrapper.add(styles.error);
  const disableTooltip = !props.error;
  return (
    <MyTooltip title={props.error || ''} disabled={disableTooltip}>
      <div className={wrapper.build()}>
        <div className={styles.label}>{props.label}: </div>
        <TextInput defaultValue={props.value} updateFunction={props.updateFunction} />
      </div>
    </MyTooltip>
  );
};

export const SignIn = () => {
  const form = useSignInForm();

  return (
    <div className={styles.wrapper}>
      <div className={styles.form}>
        <h3>Sign In</h3>
        <Input
          label="id"
          value={form.values.id}
          error={form.errors.id}
          updateFunction={(v) => form.updateValues({ id: v })}
        />
        <Input
          label="password"
          value={form.values.password}
          error={form.errors.password}
          updateFunction={(v) => form.updateValues({ password: v })}
        />
        <div className={styles.button}>
          <Button color="blue" onClick={form.submit}>
            SignIn
          </Button>
          <div className={form.errors.submit ? styles.submitError : undefined}>{form.errors.submit}</div>
        </div>
      </div>
      <div style={{ width: '320px' }}>
        <br />
        <h3>test users (id:password)</h3>
        <p>testuser1:testuser1</p>
        <p>testuser2:testuser2</p>
        <p>testuser3:testuser3</p>
      </div>
    </div>
  );
};
