import {
  DeleteOutline,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Typography,
  TextField,
  useTheme,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "../../state";
import { toast } from "react-toastify";
import CloudinaryUploader from "../../components/CloudinaryUploader";
import "../css/PostWidget.css";
import StarRating from "../../components/StarRating";
import { useNavigate } from "react-router-dom";
const PostWidget = ({
  postId,
  postUserId,
  imgUrl: initialImgUrl,
  videoUrl: initialVideoUrl,
  movieTitle: initialMovieTitle,
  releaseYear: initialReleaseYear,
  genre: initialGenre,
  description: initialDescription,
  watchedUnwatched,
  reviews,
}) => {
  const { palette } = useTheme();
  const mode = useSelector((state) => state.mode);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false); // State for edit modal
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [newDescription, setDescription] = useState(initialDescription);
  const [newMovieTitle, setMovieTitle] = useState(initialMovieTitle);
  const [newReleaseYear, setReleaseYear] = useState(initialReleaseYear);
  const [newGenre, setGenre] = useState(initialGenre);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isReview, setIsReview] = useState(false);
  const navigate = useNavigate();

  // Initialize CloudinaryUploader for save the edited post
  const cloudinaryUploader = CloudinaryUploader();

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const { _id, name } = useSelector((state) => state.user);

  const main = palette?.neutral?.main;
  const primary = palette?.primary?.main;

  const handleAddReview = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/posts/${postId}/addReview`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: _id,
            userName: name,
            rating,
            review,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setPost(data.updatedPost);
        toast.success("Review added successfully", { autoClose: 1000 });
        setRating(0);
        setReview("");
        setIsReview(false);
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  /* -----------------------------> Edit Post Implementation --------------------------< */
  const handleEditPost = async () => {
    try {
      let imgUrl = initialImgUrl;
      let videoUrl = initialVideoUrl;

      // Upload image if image is selected
      if (image != null) {
        // Get signature for Image upload
        const { timestamp: imgTimestamp, signature: imgSignature } =
          await cloudinaryUploader.getSignatureForUpload("images");
        console.log("imgTimestamp", imgTimestamp, "imgSignature", imgSignature);
        // Upload image file
        imgUrl = await cloudinaryUploader.uploadFile(
          image,
          "image",
          imgTimestamp,
          imgSignature
        );
      }

      // Upload video if video is selected
      if (video != null) {
        // Get signature for video upload
        const { timestamp: videoTimestamp, signature: videoSignature } =
          await cloudinaryUploader.getSignatureForUpload("videos");
        // Upload video file
        videoUrl = await cloudinaryUploader.uploadFile(
          video,
          "video",
          videoTimestamp,
          videoSignature
        );
      }

      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/posts/${postId}/editPost`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: newDescription,
            imgUrl,
            videoUrl,
            genre: newGenre,
            releaseYear: newReleaseYear,
            movieTitle: newMovieTitle,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(setPost({ post: data.updatedPost })); // Update the post in the state
        toast.success("Post updated successfully", { autoClose: 1000 });
        setOpenEditModal(false);
        setImage(null);
        setVideo(null);
        setDescription(initialDescription);
        setGenre(initialGenre);
        setReleaseYear(initialReleaseYear);
        setMovieTitle(initialMovieTitle);
      } else {
        // If response.ok is false, handle error
        toast.error("Failed to edit post");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Error editing post");
    }
  };

  /* ----------------- Delete Post Implementation -----------------  */

  const handleDeletePost = async () => {
    try {
      setOpenDeleteDialog(false);
      const response = await fetch(
        // here we pass the postId to delete the post
        // and the loggedInUserId to and isProfile to check when user is on the profile page then we return only userAllPost when user
        // is on the home page then we return all the post
        `${process.env.REACT_APP_Backend_URL}/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        toast.success("Post deleted successfully", { autoClose: 1000 });
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error deleting post");
    }
  };

  const handleViewMore = () => {
    navigate(`/movies/${postId}`);
  };

  const handelWatchedUnwatched = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/posts/${postId}/watchedUnwatched`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setPost(data.updatedPost);
        toast.success("Updated successfully", { autoClose: 1000 });
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      console.error("Error updating:", error);
      toast.error("Error updating");
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Box
        className="movie-card"
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <img
          style={{
            width: "100%",
            height: "70%",
            objectFit: "cover",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
          }}
          className="card-img-top"
          src={initialImgUrl}
          alt={initialMovieTitle}
        />
        <Box className="card-body" style={{ padding: "20px" }}>
          <FlexBetween style={{ marginBottom: "10px" }}>
            <Typography variant="h6" gutterBottom>
              <span>Movie Title:</span>{" "}
              <span style={{ color: "#666" }}> {initialMovieTitle}</span>
            </Typography>
            <Typography variant="h6" gutterBottom>
              <span>Release Date:</span>{" "}
              <span style={{ color: "#666" }}> {initialReleaseYear}</span>
            </Typography>
          </FlexBetween>
          <Typography variant="h6" gutterBottom>
            <span>Genre:</span>{" "}
            <span style={{ color: "#666" }}> {initialGenre}</span>
          </Typography>
          <Typography style={{ marginTop: "0.5rem" }} variant="h6" gutterBottom>
            <span>Description:</span>
            <p
              className="description text-justify"
              style={{
                fontSize: "14px",
                color: "#666",
                lineHeight: "1.6",
                maxHeight: "70px",
                overflow: "hidden",
              }}
            >
              {initialDescription}:""
            </p>
          </Typography>
          <FlexBetween>
            <IconButton onClick={() => setOpenDeleteDialog(true)}>
              <DeleteOutline />
            </IconButton>
            <IconButton onClick={() => setOpenEditModal(true)}>
              <EditOutlined />
            </IconButton>
            <Typography
              color={primary}
              onClick={() => setIsReview((prev) => !prev)}
              sx={{ cursor: "pointer" }}
            >
              Add a Review
            </Typography>
            <Typography
              color={primary}
              onClick={handleViewMore}
              sx={{ cursor: "pointer" }}
            >
              {" "}
              view more...
            </Typography>
            <Typography
              onClick={handelWatchedUnwatched}
              gutterBottom
              sx={{
                cursor: "pointer",
                color: watchedUnwatched ? "red" : "green",
              }}
            >
              {watchedUnwatched ? "unWatched" : "watched"}
            </Typography>
          </FlexBetween>
        </Box>
      </Box>

      {/* Add Rating and Review Section */}

      <Dialog open={isReview} onClose={() => setIsReview(false)}>
        <DialogTitle style={{ textAlign: "center" }}>Add a Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your rating and review for this movie.
          </DialogContentText>
          <Box mt="1rem">
            <StarRating
              value={rating}
              onChange={(newValue) => setRating(newValue)}
            />
            <TextField
              label="Add a review"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsReview(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddReview}
            disabled={!rating || !review}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* <FlexBetween >
        <IconButton onClick={() => setOpenDeleteDialog(true)}>
          <DeleteOutline />
        </IconButton>
        <IconButton onClick={() => setOpenEditModal(true)}>
          <EditOutlined />
        </IconButton>
        <Typography
          color={primary}
          onClick={() => setIsReview((prev) => !prev)}
          sx={{ cursor: "pointer" }}
        >
          Add a Review
        </Typography>

        <Typography
          color={primary}
          onClick={handleViewMore}
          sx={{ cursor: "pointer" }}
        >
          {" "}
          view more....
        </Typography>
      </FlexBetween> */}

      {/*-----------------------------------> edit Movie dialog  <------------------------------ */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-post-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: "2.5rem",
          },
        }}
      >
        <DialogTitle
          id="edit-post-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: palette.background.alt,
            color: palette.text.primary,
            fontSize: "1.2rem",
            fontWeight: "bold",
            padding: "1.5rem 0", // Adjust padding as needed
          }}
        >
          Update Movie
        </DialogTitle>
        <Divider
          sx={{
            backgroundColor: palette.text.primary,
            borderTop: `1px solid ${palette.divider}`, // Add a border at the top for separation
          }}
        />

        <DialogContent sx={{ backgroundColor: palette.background.alt }}>
          <Box display="flex" flexDirection="column" gap="1rem">
            <TextField
              label="Movie Title"
              type="text"
              name="movieTitle"
              value={newMovieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="Movie Title"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Release Year"
              type="text"
              name="releaseYear"
              value={newReleaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="Release Year"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Genre"
              type="text"
              name="genre"
              value={newGenre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
              margin="normal"
              fullWidth
            />
            <TextField
              label="Description"
              type="text"
              name="description"
              value={newDescription}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              margin="normal"
              fullWidth
              multiline
              rows={4}
            />
          </Box>

          {/* Container for Dropzone and image */}
          <Box position="relative" width="100%" mt="1rem">
            <Dropzone
              acceptedFiles={["image/*", "video/*"]} // Accept only images and videos
              multiple={false}
              onDrop={(acceptedFiles) => {
                const file = acceptedFiles[0];
                if (file.type.startsWith("image")) {
                  setImage(file);
                  setVideo(null); // Reset video if image is selected
                } else if (file.type.startsWith("video")) {
                  setVideo(file);
                  setImage(null); // Reset image if video is selected
                }
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "2px dashed",
                    borderColor: palette.primary.main,
                    borderRadius: "0.75rem",
                    p: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography variant="body1" color="textSecondary">
                    Drag & drop an image or video, or click to select a file
                  </Typography>
                </Box>
              )}
            </Dropzone>

            {/* Display selected image or video */}
            {(image || video || initialImgUrl || initialVideoUrl) && (
              <Box position="relative" mt="1rem">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                    }}
                  />
                ) : initialImgUrl ? (
                  <img
                    src={initialImgUrl}
                    alt="Selected"
                    style={{
                      width: "100%",
                      borderRadius: "0.75rem",
                    }}
                  />
                ) : null}
                {video ? (
                  <video
                    width="100%"
                    height="auto"
                    controls
                    style={{
                      borderRadius: "0.75rem",
                    }}
                  >
                    <source src={URL.createObjectURL(video)} />
                  </video>
                ) : initialVideoUrl ? (
                  <video
                    width="100%"
                    height="auto"
                    controls
                    style={{
                      borderRadius: "0.75rem",
                    }}
                  >
                    <source src={initialVideoUrl} />
                  </video>
                ) : null}

                {/* Delete button for image or video */}
                {image || video ? (
                  <IconButton
                    onClick={() => {
                      setImage(null);
                      setVideo(null);
                    }}
                    sx={{
                      position: "absolute",
                      top: "0.5rem",
                      right: "0.5rem",
                      backgroundColor:
                        mode === "dark" ? palette.grey[800] : palette.grey[200],
                      borderRadius: "50%",
                      "&:hover": {
                        backgroundColor:
                          mode === "dark"
                            ? palette.grey[900]
                            : palette.grey[300],
                      },
                    }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                ) : null}
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            padding: "1rem",
            backgroundColor: palette.background.alt,
            borderTop: `1px solid ${palette.divider}`, // Add a border at the top for separation
          }}
        >
          <Button
            onClick={() => {
              setOpenEditModal(false);
              setImage(null);
              setVideo(null);
            }}
            sx={{
              cursor: "pointer",
            }}
          >
            Cancel
          </Button>
          {(image ||
            video ||
            newDescription !== initialDescription ||
            newMovieTitle !== initialMovieTitle ||
            newReleaseYear !== initialReleaseYear ||
            newGenre !== initialGenre) && (
            <Button variant="contained" onClick={handleEditPost}>
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
      {/*---------------->  Delete confirmation dialog -------------<*/}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Post?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Movie?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeletePost} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </WidgetWrapper>
  );
};

export default PostWidget;
