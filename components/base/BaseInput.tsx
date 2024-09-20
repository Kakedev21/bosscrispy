import { View } from 'react-native';
import { Input } from '../Input';
import React from 'react';
import { SetStateType } from '@/typescript/globals';

interface BaseInputProps {
  value: string;
  setValue: SetStateType<string>;
  placeholder?: string;
  secureTextEntry?: boolean;
  className?: string;
}

const BaseInput: React.FC<BaseInputProps> = ({
  value,
  setValue,
  placeholder = '',
  secureTextEntry = false,
  className = ''
}) => {
  return (
    <View>
      <Input
        value={value}
        keyboardType='number-pad'
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className={className}
      />
    </View>
  );
}

export default BaseInput;
