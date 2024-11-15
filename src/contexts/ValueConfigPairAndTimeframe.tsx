import { createContext, ReactNode, useState } from "react";

export interface ValuePairType {
  selectedPair: string;
  setSelectedPair: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
  selectedTime: string;
}
const ValueContext = createContext<ValuePairType | undefined>(undefined);

export const ValueConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // значения по умолчанию
  const [selectedPair, setSelectedPair] = useState("BTCUSDT");
  const [selectedTime, setSelectedTime] = useState("1m");

  return (
    <ValueContext.Provider
      value={{ selectedPair, setSelectedPair, selectedTime, setSelectedTime }}
    >
      {children}
    </ValueContext.Provider>
  );
};
export { ValueContext };
