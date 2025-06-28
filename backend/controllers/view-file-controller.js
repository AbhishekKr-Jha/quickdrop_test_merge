import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import jwt from "jsonwebtoken";
import { s3ClientAws } from "../index.js";

const get_presigned_view_url = async (key) => {
  const command = new GetObjectCommand({
    Bucket: "bucketquickdrop",
    Key: key,
  });
  try {
    const view_url = await getSignedUrl(s3ClientAws, command);
    // console.log("thye list value is", view_url);
    return view_url;
  } catch (error) {
    return "something went wrong";
  }
};

export const upload_list_generator = async (req, res) => {
  const { userEmail, token } = req.body;
  const view_url_array = [];
 
  try {
    const verifyAccessToken = jwt.verify(token, "my_super_secret_key_123");

    const command = new ListObjectsV2Command({
      Bucket: "bucketquickdrop",
      // Key:`/${userEmail}`,
      Prefix: `/${userEmail}/`,
    });

    const upload_list = await s3ClientAws.send(command);

    if (upload_list?.KeyCount == 0)
      return res.status(500).json({
        success: false,
        userValidation: false,
        message: "No data available",
      });

    // console.log("the upload lost is", upload_list);
    // let url= await get_presigned_view_url(upload_list.Contents[0].Key)

    for (let element of upload_list?.Contents) {
      let url = await get_presigned_view_url(element?.Key);
 
      view_url_array.push({
        key: element?.Key,
        view_url: url,
      });
    }

    res.status(200).json({
      success: true,
      list: upload_list,
      url_list: view_url_array,
      userValidation: true,
      message: " List generated Successfully!",
    });
  } catch (error) {
    console.log("error occured", error.name);
    console.log(error);
    res.status(500).json({
      success: false,
      userValidation: false,
      message: "Invalid User!",
    });
  }
};
