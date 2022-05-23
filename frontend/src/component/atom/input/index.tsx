import React from 'react';

import styles from './index.module.scss';

type TextInputProps = {
  title?: string;
  updateFunction: (value: string) => void;
  updateOnEnter?: boolean;
  updateOnChange?: boolean;
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const TextInput = ({ title, updateFunction, updateOnEnter, updateOnChange, ...otherProps }: TextInputProps) => {
  const update = (
    e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => updateFunction(e.currentTarget.value);

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined = updateOnEnter
    ? (e) => (e.key === 'Enter' ? update(e) : undefined)
    : undefined;

  const onChange: React.ChangeEventHandler<HTMLInputElement> | undefined = updateOnChange ? update : undefined;

  return (
    <>
      {title && <div className={styles.label}>{title}</div>}
      <input className={styles.input} onChange={onChange} onBlur={update} onKeyDown={onKeyDown} {...otherProps} />
    </>
  );
};
