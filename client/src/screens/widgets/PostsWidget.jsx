import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";
import "../css/PostsWidget.css";

const PostsWidget = ({ watchedMovie, unwatchedMovie }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const getPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_Backend_URL}/posts/${_id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    getPosts();
  }, []);

  // Filter posts based on props
  const filteredPosts = posts.filter((post) => {
    if (watchedMovie && post.watchedUnwatched) {
      return true; // Return if watchedMovie is true and post is watched
    } else if (unwatchedMovie && !post.watchedUnwatched) {
      return true; // Return if unwatchedMovie is true and post is unwatched
    }
    return false; // Default: do not return post
  });

  return (
    <div className="posts-container">
      {filteredPosts.map(
        ({
          _id,
          userId,
          movieTitle,
          genre,
          releaseYear,
          description,
          imgUrl,
          videoUrl,
          watchedUnwatched,
          reviews,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            movieTitle={movieTitle}
            description={description}
            releaseYear={releaseYear}
            genre={genre}
            watchedUnwatched={watchedUnwatched}
            imgUrl={imgUrl}
            videoUrl={videoUrl}
            reviews={reviews}
          />
        )
      )}
    </div>
  );
};

export default PostsWidget;
