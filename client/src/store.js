import React, { useContext, useState, createContext } from "react";

export const StoreContext = createContext({
    formModal: {},
    deleteModal: {},
    contact: {},
    updateStore: () => {},
});

export const StoreProvider = ({ children }) => {
    const [store, setStore] = useState({
        modal: {
            name: null,
            data: {},
        },
    });

    const updateStore = (key, state) => {
        setStore(prevStore => ({
            ...prevStore,
            [key]: {
                ...prevStore[key],
                ...state,
            }
        }))
    }


    return (
        <StoreContext.Provider value={{ ...store, updateStore }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStore = () => useContext(StoreContext);
