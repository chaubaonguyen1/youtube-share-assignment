import {IMovie} from "../../models/movie";
import styles from './MovieItem.module.scss';
import {useAuth} from "../../contexts/AuthContext";
import {DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined} from "@ant-design/icons";
import {Button, Space} from "antd";

interface IMovieItemProps {
  movie: IMovie;
  voteUp: () => void;
  voteDown: () => void;
  unVote: () => void;
}

export function MovieItem({movie, voteUp, voteDown, unVote}: IMovieItemProps) {
  const {isLogged, user} = useAuth();

  const voteButtons = () => {
    if (!isLogged) return <></>;

    if (movie.likes.includes(user?.email || '')) {
      return <Space className={styles.voteButtons}>
        <Button
          type={'text'}
          htmlType={'button'}
          className={styles.voteButton}
          onClick={unVote}
        >
          <LikeFilled/>
        </Button>
        <p className={styles.voteButtonText}>(voted up)</p>
      </Space>
    }

    if (movie.dislikes.includes(user?.email || '')) {
      return <Space className={styles.voteButtons}>
        <Button
          type={'text'}
          htmlType={'button'}
          className={styles.voteButton}
          onClick={unVote}
        >
          <DislikeFilled/>
        </Button>
        <p className={styles.voteButtonText}>(voted down)</p>
      </Space>
    }

    return (
      <Space className={styles.voteButtons}>
        <Button
          type={'text'}
          htmlType={'button'}
          className={styles.voteButton}
          onClick={voteUp}
        >
          <LikeOutlined className={styles.voteButton}/>
        </Button>
        <Button
          type={'text'}
          htmlType={'button'}
          className={styles.voteButton}
          onClick={voteDown}
        >
          <DislikeOutlined className={styles.voteButton}/>
        </Button>
        <p className={styles.voteButtonText}>(un-voted)</p>
      </Space>
    )
  }

  return (
    <div className={styles.container} data-testid="movie-item">
      <div>
        <iframe
          width="400"
          height="230"
          src={`https://www.youtube.com/embed/${movie.snippetId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen/>
      </div>
      <div>
        <Space>
          <div>
            <h2>{movie.snippet.localized.title}</h2>
            <p>Shared by: <b>{movie.sharedBy}</b></p>
            <Space>
              <div>{movie.likes.length} <LikeOutlined/></div>
              <div>{movie.dislikes.length} <DislikeOutlined/></div>
            </Space>
          </div>
          <div>
            {voteButtons()}
          </div>
        </Space>
        <p className={styles.description}>{movie.snippet.localized.description}</p>
      </div>
    </div>
  );
}