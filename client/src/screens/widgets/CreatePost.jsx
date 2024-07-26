import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
} from "@mui/icons-material";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import CloudinaryUploader from "../../components/CloudinaryUploader";
import { useNavigate } from "react-router-dom";

// props data came from homePage/index.jsx
const CreatePost = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(true);
  const [isVideo, setIsVideo] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [movieTitle, setMovieTitle] = useState(""); // New state for movie title
  const [genre, setGenre] = useState(""); // New state for genre
  const [releaseYear, setReleaseYear] = useState(""); // New state for release year
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const navigate = useNavigate();
  const mode = useSelector((state) => state.mode);
  const primaryColor = palette.primary.main;

  // Initialize CloudinaryUploader
  const cloudinaryUploader = CloudinaryUploader();

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let imgUrl = null;
      let videoUrl = null;

      // Upload image if available
      if (image != null) {
        // Get signature for Image upload
        const { timestamp: imgTimestamp, signature: imgSignature } =
          await cloudinaryUploader.getSignatureForUpload("images");
        // Upload image file
        imgUrl = await cloudinaryUploader.uploadFile(
          image,
          "image",
          imgTimestamp,
          imgSignature
        );
      }

      // Upload video if available
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

      // Once all uploads are complete, proceed with creating the post
      const response = await fetch(
        `${process.env.REACT_APP_Backend_URL}/posts/createPost`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: _id,
            description,
            imgUrl,
            videoUrl,
            movieTitle,
            genre,
            releaseYear,
          }),
        }
      );
      const posts = await response.json();

      toast.success("Post created successfully", { autoClose: 1000 });
      console.log("File upload success!");
      dispatch(setPosts({ posts }));
      console.log(posts);
      // after successful post, reset the image and description and video states
      setImage(null);
      setVideo(null);
      setIsVideo(false);
      setIsImage(false);
      setDescription("");
      setMovieTitle("");
      setGenre("");
      setReleaseYear("");
      setIsLoading(false);
      navigate("/unwatchedMovie");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <WidgetWrapper>
      <form onSubmit={handlePost}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <Typography variant="h4" sx={{ color: mediumMain }}>
            Add New Movies to Your Watchlist
          </Typography>
        </Box>

        <Divider sx={{ margin: "1.25rem 0" }} />

        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Typography
            color="primary"
            sx={{
              marginBottom: "0.5rem",
              "&:hover": { color: medium, cursor: "pointer" },
            }}
          >
            Movie Title
          </Typography>
          <InputBase
            placeholder="Enter movie title"
            onChange={(e) => setMovieTitle(e.target.value)}
            value={movieTitle}
            sx={{
              width: "100%",
              backgroundColor: palette.background.default,
              borderRadius: "2rem",
              padding: "0.75rem 2rem",
            }}
          />
        </Box>
        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Typography
            color="primary"
            sx={{
              marginBottom: "0.5rem",
              "&:hover": { color: medium, cursor: "pointer" },
            }}
          >
            Genre
          </Typography>
          <InputBase
            placeholder="Enter genre"
            onChange={(e) => setGenre(e.target.value)}
            value={genre}
            sx={{
              width: "100%",
              backgroundColor: palette.background.default,
              borderRadius: "2rem",
              padding: "0.75rem 2rem",
            }}
          />
        </Box>
        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Typography
            color="primary"
            sx={{
              marginBottom: "0.5rem",
              "&:hover": { color: medium, cursor: "pointer" },
            }}
          >
            Release Year
          </Typography>
          <InputBase
            placeholder="Enter release year"
            onChange={(e) => setReleaseYear(e.target.value)}
            value={releaseYear}
            type="text"
            sx={{
              width: "100%",
              backgroundColor: palette.background.default,
              borderRadius: "2rem",
              padding: "0.75rem 2rem",
            }}
          />
        </Box>
        <Box sx={{ width: "100%", marginTop: "1rem" }}>
          <Typography
            color="primary"
            sx={{
              marginBottom: "0.5rem",
              "&:hover": { color: medium, cursor: "pointer" },
            }}
          >
            Description
          </Typography>
          <InputBase
            placeholder="Description ..."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            multiline
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setDescription((prevDescription) => prevDescription + "\n");
              }
            }}
            sx={{
              width: "100%",
              backgroundColor: palette.background.default,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </Box>

        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles="image/*"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <Box
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                      >
                        <Typography>Add Movie Poster Here</Typography>
                      </Box>
                    ) : (
                      <FlexBetween>
                        <Box>
                          <img
                            width="100%"
                            height="auto"
                            alt="post"
                            style={{
                              borderRadius: "0.75rem",
                              marginTop: "0rem",
                            }}
                            src={URL.createObjectURL(image)}
                          />
                        </Box>
                        <IconButton
                          onClick={() => setImage(null)}
                          sx={{ width: "9%" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </FlexBetween>
                    )}
                  </Box>
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
        {isVideo && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles="video/*"
              multiple={false}
              onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!video ? (
                      <Box
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                      >
                        <Typography>Add Movie Trailer Here</Typography>
                      </Box>
                    ) : (
                      <FlexBetween alignItems="center">
                        <Box>
                          <video
                            width="100%"
                            height="auto"
                            alt="video"
                            controls
                            style={{
                              borderRadius: "0.75rem",
                              marginTop: "0rem",
                            }}
                          >
                            <source
                              src={URL.createObjectURL(video)}
                              type={video.type}
                            />
                          </video>
                        </Box>
                        <IconButton
                          onClick={() => setVideo(null)}
                          sx={{ width: "9%" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </FlexBetween>
                    )}
                  </Box>
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}

        <FlexBetween sx={{ width: "100%", marginTop: "1rem" }}>
          <FlexBetween gap="1rem">
            <FlexBetween
              gap="0.25rem"
              onClick={() => {
                setIsImage(!isImage);
                setIsVideo(false);
                setVideo(null);
              }}
              sx={{ cursor: "pointer" }}
            >
              <ImageOutlined sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{
                  "&:hover": { cursor: "pointer", color: medium },
                }}
              >
                Poster
              </Typography>
            </FlexBetween>
            <FlexBetween
              gap="0.25rem"
              onClick={() => {
                setIsVideo(!isVideo);
                setIsImage(false);
                setImage(null);
              }}
              sx={{ cursor: "pointer" }}
            >
              <VideoFileIcon sx={{ color: mediumMain }} />
              <Typography
                color={mediumMain}
                sx={{
                  "&:hover": { cursor: "pointer", color: medium },
                }}
              >
                Trailer
              </Typography>
            </FlexBetween>
          </FlexBetween>
        </FlexBetween>

        {isLoading ? (
          <WidgetWrapper>
            <Loading />
          </WidgetWrapper>
        ) : (
          <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
            <Button
              disabled={
                !description ||
                (!image && !video) ||
                !genre ||
                !releaseYear ||
                !movieTitle ||
                isLoading
              }
              type="submit"
              sx={{
                borderRadius: "3rem",
                backgroundColor: palette.primary.light,
                // color: palette.common.white,
                color: "black",
                "&:hover": {
                  backgroundColor: palette.primary.light,
                },
              }}
            >
              {isLoading ? <Loading /> : "ADD"}
            </Button>
          </Box>
        )}
      </form>
    </WidgetWrapper>
  );
};

export default CreatePost;
