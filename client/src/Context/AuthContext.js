import { createContext, useEffect, useReducer, useContext } from "react";

const INITIAL_STATE = {
  customer: JSON.parse(sessionStorage.getItem("customer")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { customer: null, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return { customer: action.payload, loading: false, error: null };

    case "LOGIN_FAILURE":
      return { customer: null, loading: false, error: action.payload };

    case "LOGOUT":
      sessionStorage.removeItem("customer");
      return { customer: null, loading: false, error: null };

    case "REFRESH_CART":
      return {
        ...state,
        customer: {
          ...state.customer,
          cart: action.payload,
        },
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.customer) {
      sessionStorage.setItem("customer", JSON.stringify(state.customer));
    }
  }, [state.customer]);

  return (
    <AuthContext.Provider
      value={{
        customer: state.customer,
        cart: state.customer ? state.customer.cart : [],
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
