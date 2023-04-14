import React, {useEffect, useState} from "react";
import {movieGetRef, movieUnVote, movieVoteDown, movieVoteUp} from "../../services/movie";
import {IMovie} from "../../models/movie";
import {Layout} from "antd";
import {MovieItem} from "../../components/MovieItem/MovieItem";
import {useAuth} from "../../contexts/AuthContext";

export default function Home() {
  const {isLogged, user} = useAuth();
  const moviesRef = movieGetRef();
  const [movies, setMovies] = useState<IMovie[]>([]);

  useEffect(() => {
    moviesRef.on('value', (snapshot) => {
      const moviesSnapshot: IMovie[] = [];

      snapshot.forEach((childSnapshot) => {
        moviesSnapshot.push({
          key: childSnapshot.key || '',
          likes: [],
          dislikes: [],
          ...childSnapshot.val(),
        })
      });

      setMovies(moviesSnapshot);
    })

    return () => {
      moviesRef.off();
    }
  });

  const handleVote = (key: string, type: 'up' | 'down' | 'undo') => {
    if (isLogged && key) {
      setMovies(movies.map((m) => {
        if (m.key === key) {
          switch (type) {
            case 'up':
              if (!m.likes.includes(user?.email || '')) {
                m.likes.push(user?.email || '');
                m.dislikes = m.dislikes.filter((email) => email !== user?.email);

                movieVoteUp(key, user?.email || '');
              }
              break;

            case 'down':
              if (!m.dislikes.includes(user?.email || '')) {
                m.dislikes.push(user?.email || '');
                m.likes = m.likes.filter((email) => email !== user?.email);

                movieVoteDown(key, user?.email || '');
              }
              break;

            case 'undo':
              m.dislikes = m.dislikes.filter((email) => email !== user?.email);
              m.likes = m.likes.filter((email) => email !== user?.email);

              movieUnVote(key, user?.email || '');
              break;

          }
        }

        return m;
      }));
    }
  }


  return (
    <Layout>
      {movies.map((movie) =>
        <MovieItem
          key={movie.key}
          movie={movie}
          voteUp={() => handleVote(movie.key || '', 'up')}
          voteDown={() => handleVote(movie.key || '', 'down')}
          unVote={() => handleVote(movie.key || '', 'undo')}
        />
      )}
    </Layout>
  )
}