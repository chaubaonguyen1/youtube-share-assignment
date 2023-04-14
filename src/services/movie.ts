import {IYoutubeResult} from "../models/youtube";
import {handleError} from "../helper/function";
import {IMovie} from "../models/movie";
import firebase from "firebase/compat/app";
import {message} from "antd";
import {FIREBASE_TABLE} from "../config/const";
import {firebaseDB} from "../firebase/firebase";

export const movieGetRef = (): firebase.database.Reference => {
  return firebaseDB.ref(FIREBASE_TABLE.MOVIES)
}

export const movieAdd = async (url: string, userEmail: string): Promise<void> => {
  let snippetId: string = '';

  try {
    if (url.includes('youtu.be')) {
      snippetId = url.split('/').pop() || '';
    } else if (url.includes('youtube.com')) {
      snippetId = url.split('v=').pop() || '';
      if (snippetId.includes('&')) {
        snippetId = snippetId.split('&')[0];
      }
    }

    const api = await fetch(
      `${process.env.REACT_APP_YOUTUBE_API_URL}videos?part=snippet&id=${snippetId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
    )

    const response: IYoutubeResult = await api.json();

    if (response.items.length === 0) {
      throw new Error('The requested video was not found or the URL was not formatted properly');
    }

    const newMovie: IMovie =  {
      snippetId,
      sharedBy: userEmail,
      snippet: response.items[0].snippet,
      likes: [],
      dislikes: []
    }

    await firebaseDB.ref(FIREBASE_TABLE.MOVIES).push(newMovie)

    message.success('Movie added successfully!');

    return Promise.resolve();

  } catch (err) {
    await handleError(err)
    throw err;
  }

}

export const movieVoteUp = async (key: string, userEmail: string): Promise<void> => {
  try {
    const movieRef = firebaseDB.ref(`${FIREBASE_TABLE.MOVIES}/${key}`);
    const movie = (await movieRef.once('value')).val();

    movie.likes = movie.likes || [];
    movie.dislikes = movie.dislikes || [];

    if (movie.likes.includes(userEmail)) {
      throw new Error('You have already voted up this movie');
    }

    if (movie.dislikes.includes(userEmail)) {
      movie.dislikes = movie.dislikes.filter((email: string) => email !== userEmail);
    }

    movie.likes.push(userEmail);

    await movieRef.set(movie);

    message.success('Movie voted up successfully!');

    return Promise.resolve();

  } catch (err) {
    await handleError(err)
    throw err;
  }
}

export const movieVoteDown = async (key: string, userEmail: string): Promise<void> => {
  try {
    const movieRef = firebaseDB.ref(`${FIREBASE_TABLE.MOVIES}/${key}`);
    const movie = (await movieRef.once('value')).val();

    movie.likes = movie.likes || [];
    movie.dislikes = movie.dislikes || [];

    if (movie.dislikes.includes(userEmail)) {
      throw new Error('You have already voted down this movie');
    }

    if (movie.likes.includes(userEmail)) {
      movie.likes = movie.likes.filter((email: string) => email !== userEmail);
    }

    movie.dislikes.push(userEmail);

    await movieRef.set(movie);

    message.success('Movie voted down successfully!');

    return Promise.resolve();

  } catch (err) {
    await handleError(err)
    throw err;
  }
}

export const movieUnVote = async (key: string, userEmail: string): Promise<void> => {
  try {
    const movieRef = firebaseDB.ref(`${FIREBASE_TABLE.MOVIES}/${key}`);
    const movie = (await movieRef.once('value')).val();

    movie.likes = movie.likes || [];
    movie.dislikes = movie.dislikes || [];

    if (movie.likes.includes(userEmail)) {
      movie.likes = movie.likes.filter((email: string) => email !== userEmail);
    }

    if (movie.dislikes.includes(userEmail)) {
      movie.dislikes = movie.dislikes.filter((email: string) => email !== userEmail);
    }

    await movieRef.set(movie);

    message.success('Movie un-voted successfully!');

    return Promise.resolve();

  } catch (err) {
    await handleError(err)
    throw err;
  }
}
