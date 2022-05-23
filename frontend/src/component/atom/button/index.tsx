import React from 'react';

import { styler } from 'component/util/styler';

import styles from './index.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  color?: 'white' | 'blue' | 'gray';
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button = ({ children, color, className, ...others }: ButtonProps) => {
  const style = styler(styles.button, styles[color || 'white']);
  if (className) style.add(className);
  return (
    <button className={style.build()} {...others}>
      {children}
    </button>
  );
};
