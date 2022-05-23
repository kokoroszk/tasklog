import React from 'react';
import { Tooltip } from '@mui/material';

type Props = Parameters<typeof Tooltip>[0] & {
  disabled?: boolean;
};
export const MyTooltip = ({ children, disabled, ...props }: Props) => {
  if (disabled) return <>{children}</>;
  return (
    <Tooltip arrow placement="left" enterDelay={50} {...props}>
      {children}
    </Tooltip>
  );
};
