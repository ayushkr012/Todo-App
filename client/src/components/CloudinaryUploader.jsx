

const CloudinaryUploader = () => {
  const uploadFile = async (file, type, timestamp, signature) => {
    const folder = type === "image" ? "images" : "videos";

    const data = new FormData();
    data.append("file", file);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
    data.append("folder", folder);

    try {
      let cloudName = "debwa5itl";
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await fetch(api, {
        method: "POST",
        body: data,
      });
      const responseData = await res.json();
      const { secure_url } = responseData;
      console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const getSignatureForUpload = async (folder) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_Backend_URL}/uploadfile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folder }),
        }
      );
      const { timestamp, signature } = await res.json();
      return { timestamp, signature };
    } catch (error) {
      console.error(error);
    }
  };

  return { getSignatureForUpload, uploadFile };
};

export default CloudinaryUploader;
