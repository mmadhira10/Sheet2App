import { createContext, useContext, useState } from 'react'

export const GlobalStoreContext = createContext({});

function GlobalStoreContextProvider(props) {
    const [currentApp, setCurrentApp] = useState(null);

    return (
        <GlobalStoreContext.Provider value={{currentApp, setCurrentApp}}>
            {props.children}
        </GlobalStoreContext.Provider>
    )
}

export default GlobalStoreContextProvider;
export { GlobalStoreContextProvider }


