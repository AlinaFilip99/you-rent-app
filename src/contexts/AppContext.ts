import { createContext } from 'react';
import IAppContext from '../interfaces/IAppContext';
const AppContext = createContext<IAppContext | undefined>(undefined);
export default AppContext;
