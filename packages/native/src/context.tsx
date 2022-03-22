import { createContext, CSSProperties, ReactNode, useContext, useMemo, useReducer } from 'react';

const SET_PROCESS_STYLE_FUNC = 'SET_PROCESS_STYLE_FUNC';

type Action = {
  type: typeof SET_PROCESS_STYLE_FUNC,
  payload: { processStyle?: (k: CSSProperties) => void },
};
type Dispatch = (action: Action) => void;
type State = { processStyle: any };
type NativeProviderProps = { processStyle: any, children: ReactNode };

const NativeContext = createContext<
  { state: State, dispatch: Dispatch } | undefined
>(undefined);

function nativeReducer(state: State, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case SET_PROCESS_STYLE_FUNC: {
      const { processStyle } = payload;
      return { ...state, processStyle };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`)
    }
  }
}

export const useNative = (): [State?, Dispatch?] => {
  const context = useContext(NativeContext);

  return [context?.state, context?.dispatch];
};

export const setProcessStyle = (func: (k: CSSProperties) => void, dispatch: Dispatch) => {
  // const [state, dispatch] = useNative();

  if (dispatch) {
    dispatch({ type: SET_PROCESS_STYLE_FUNC, payload: { processStyle: func } });
  }
}

export function RPNativeProvider({ processStyle, children }: NativeProviderProps) {
  const [state, dispatch] = useReducer(nativeReducer, { processStyle: (style: CSSProperties) => ({ style }) });

  // NOTE: you *might* need to memoize this value

  const value = useMemo(() => ({ state: { ...state, processStyle }, dispatch }), [state]);

  return (
    <NativeContext.Provider value={value}>
      {children}
    </NativeContext.Provider>
  );
}


export const getInjectedStyles = (styles: CSSProperties) => {
  const [state, dispatch] = useNative();
  // console.log({ state }); - if DEBUG
  const { processStyle } = state || {};

  return processStyle(styles)
};
