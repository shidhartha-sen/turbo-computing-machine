import React, { createContext, useContext, useState } from "react";

interface TranslationContextType {
  isTranslating: boolean;
  setIsTranslating: (value: boolean) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  isTranslating: false,
  setIsTranslating: () => {},
});

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTranslating, setIsTranslating] = useState(false);

  return (
    <TranslationContext.Provider value={{ isTranslating, setIsTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslatingState() {
  return useContext(TranslationContext);
}
