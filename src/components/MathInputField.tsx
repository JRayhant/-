import React from 'react';
import { MathInput, MathInputProps } from './shared/MathInput';

export interface MathInputFieldProps extends MathInputProps {
  autoShowKeyboard?: boolean;
}

export const MathInputField: React.FC<MathInputFieldProps> = (props) => {
  return <MathInput {...props} />;
};

export { MathInput };
