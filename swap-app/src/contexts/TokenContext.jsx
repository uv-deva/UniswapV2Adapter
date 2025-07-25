import React, { createContext, useContext, useState } from 'react';

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');

  const swapTokens = () => {
    setTokenA(prev => {
      setTokenB(prev);
      return tokenB;
    });
  };

  return (
    <TokenContext.Provider value={{ tokenA, tokenB, setTokenA, setTokenB, swapTokens }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokenContext = () => useContext(TokenContext);
