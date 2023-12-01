import IAppState from './IAppState';
interface IAppContext {
    state: IAppState | null | undefined | any;
    setState: null | undefined | any;
    // updateStateData: null | undefined | any;
    // finalizeRefreshEvent: Function;
}
export default IAppContext;
