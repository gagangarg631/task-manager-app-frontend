import React, { createContext, useContext, useState } from 'react';
import { Snackbar } from 'react-native-paper';

type SnackbarContextType = {
  showSnackbar: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const showSnackbar = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: 'OK',
          onPress: () => setVisible(false),
        }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
