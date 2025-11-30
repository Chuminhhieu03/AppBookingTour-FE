import React, { createContext, useContext } from "react";
import { message, Modal } from "antd";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [modalApi, modalContextHolder] = Modal.useModal();

  return (
    <UIContext.Provider value={{ messageApi, modalApi }}>
      {messageContextHolder}
      {modalContextHolder}
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);