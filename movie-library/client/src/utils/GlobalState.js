import React, { createContext, useContext } from "react";
import { useMovieReducer } from './reducers';

const FantinderContext = createContext();
const { Provider } = FantinderContext;

const FantinderProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useMovieReducer({
      likedMovies: [],  
      dislikedMovies: [], 
      movies: []  
    });
    console.log({state}); 
    return <Provider value={[state, dispatch]} {...props} />;
  };

const useFantinderContext = () => {
    return useContext(FantinderContext);
};

export { FantinderProvider, useFantinderContext };
