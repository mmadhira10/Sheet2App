import { createContext, useContext, useState } from 'react'
import api from '../app-routes'

export const GlobalStoreContext = createContext({});

// Define the timeout for the cache in milliseconds
const CACHE_TIMEOUT = 300000; // 5 minutes

function GlobalStoreContextProvider(props) {
    const [currentApp, setCurrentApp] = useState(null);
    const [tableDataCache, setTableDataCache] = useState({});

    const getTableDataFromCache = async function (url) {
        if (tableDataCache[url] && Date.now() - tableDataCache[url].timestamp < CACHE_TIMEOUT) {
            return tableDataCache[url].data;
        }

        return updateCache(url);
    }

    const updateCache = async function (url) {
        const response = await api.post("/getDataFromURL/", {url: url});
        setTableDataCache({
            ...tableDataCache,
            [url]: {
                data : response.data.data,
                timestamp: Date.now()
            }
        })

        return response.data.data;
    }

    const clearCache = () => {
        setTableDataCache({});
      };
    return (
        <GlobalStoreContext.Provider value={{currentApp, setCurrentApp, getTableDataFromCache,updateCache, clearCache }}>
            {props.children}
        </GlobalStoreContext.Provider>
    )
}

export default GlobalStoreContextProvider;
export { GlobalStoreContextProvider }


