import React, { useEffect } from 'react';
import { Jumbotron, CardColumns, Container } from 'react-bootstrap';
import MovieCard from '../components/MovieCard';
import { DISLIKE_MOVIE, LIKE_MOVIE } from '../utils/mutations';
import { GET_USER } from '../utils/queries';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useFantinderContext } from "../utils/GlobalState";
import { UPDATE_MOVIE_PREFERENCES } from '../utils/actions';
import { idbPromise } from "../utils/helpers";
import { findIndexByAttr } from '../utils/helpers'

const SavedMovies = () => {
    const [state, dispatch] = useFantinderContext();
    const { likedMovies, dislikedMovies } = state;
    const [dislikeMovie] = useMutation(DISLIKE_MOVIE);
    const [likeMovie] = useMutation(LIKE_MOVIE);
    const { loading, data } = useQuery(GET_USER);

    useEffect(() => {
        if (!likedMovies.length && !dislikedMovies.length) {
            if (data && data.me) {
                if (data.me.likedMovies.length || !data.me.dislikedMovies.length) {
                    console.log("Online, using data from server to update movie preferences")
                    dispatch({
                        type: UPDATE_MOVIE_PREFERENCES,
                        likedMovies: data.me.likedMovies,
                        dislikedMovies: data.me.dislikedMovies
                    });
                }
            }
            else if (!loading) {
                idbPromise('likedMovies', 'get').then(likedMovies => {
                    idbPromise('dislikedMovies', 'get').then(dislikedMovies => {
                        if (dislikedMovies.length || likedMovies.length) {
                            console.log("Offline, using data from idb to update movie preferences")
                            dispatch({
                                type: UPDATE_MOVIE_PREFERENCES,
                                likedMovies,
                                dislikedMovies
                            })
                        }
                    })
                })
            }
        }
    }, [data, loading, likedMovies, dislikedMovies, dispatch])

    const handleLikeMovie = (likedMovie) => {
        likeMovie({
            variables: { movieId: likedMovie._id }
        })
        .then(({data}) => {
            console.log(data.likeMovie)
            if (data) {

                dispatch({
                    type: UPDATE_MOVIE_PREFERENCES,
                    likedMovies: data.likeMovie.likedMovies,
                    dislikedMovies: data.likeMovie.dislikedMovies
                });
    
                const likedMovieIndex = findIndexByAttr(data.likeMovie.likedMovies, '_id', likedMovie._id);
                const updatedLikedMovie = data.likeMovie.likedMovies[likedMovieIndex];

                idbPromise('likedMovies', 'put', updatedLikedMovie);
                idbPromise('dislikedMovies', 'delete', updatedLikedMovie);
            } else {
                console.error("Couldn't like the movie!");
            }
        })
        .catch(err => console.error(err));
    };

    const handleDislikeMovie = (dislikedMovie) => {

        dislikeMovie({
            variables: { movieId: dislikedMovie._id }
        })
        .then(async ({data}) => {
            if (data) {
                dispatch({
                    type: UPDATE_MOVIE_PREFERENCES,
                    likedMovies: data.dislikeMovie.likedMovies,
                    dislikedMovies: data.dislikeMovie.dislikedMovies
                });
    
                const dislikedMovieIndex = await findIndexByAttr(data.dislikeMovie.dislikedMovies, '_id', dislikedMovie._id);
                const updatedDislikedMovie = data.dislikeMovie.dislikedMovies[dislikedMovieIndex];
    
                idbPromise('likedMovies', 'delete', updatedDislikedMovie);
                idbPromise('dislikedMovies', 'put', updatedDislikedMovie);
            } else {
                console.error("Couldn't dislike the movie!");
            }
        })
        .catch(err => console.error(err));
    };

    return (
        <>
            <Jumbotron fluid className="text-light bg-dark">
                <Container>
                    <h1>My Movies</h1>
                </Container>
            </Jumbotron>
            <Container>
                <h2 className="pb-5">
                    {likedMovies.length 
                    ? `Displaying ${likedMovies.length} saved ${likedMovies.length === 1 ? "movie" : "movies"}:`
                    : "You have no saved movies!"   
                    }
                    
                </h2>
                <CardColumns>
                    {likedMovies?.length && likedMovies.length > 0
                    ? likedMovies.map(movie => {
                        return (
                            <MovieCard
                                key={movie._id}
                                movie={movie}
                                displayTrailer
                                likeMovieHandler={handleLikeMovie}
                                dislikeMovieHandler={handleDislikeMovie}
                            />
                        )})
                    : null}
                </CardColumns>
            </Container>
        </>
    );
};

export default SavedMovies;