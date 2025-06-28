import axios from 'axios'

// const BACKENED_URL="http://localhost:3000/api/v1" 
const BACKENED_URL=`${import.meta.env.VITE_BACKEND_URL}api/v1` 

 

export const get_func =async(route)=>{
try {
    const response = await axios.get(`${BACKENED_URL}${route}`)
    console.log(response.data)
    return {
      success: response.status === 200,
      response: response.data
    }
} catch (error) {
    console.log("error occured")
}
}




export const post_func = async (route,content_type, payload) => {
    try {
      const response = await axios.post(`${BACKENED_URL}${route}`, payload, {
        headers: {
          'Content-Type': content_type
        },
      });
  
      return {
        success: response.status === 200,
        response: response.data
      };
    } catch (error) {
      console.log("Error occurred:", error.response.data);
      return error.response.data
    }
  };


  
export const put_func = async (route,content_type, payload) => {
  try {
    const response = await axios.put(route, payload, {
      headers: {
        'Content-Type': content_type
      },
    });

    return {
      success: response.status === 200,
      response: response.data
    };
  } catch (error) {
    console.log("Error occurred:", error.message);
    return {
      success: false,
      message: error.message
    };
  }
};






export const delete_func = async (route, payload) => {
  try {
    const response = await axios.delete(`${BACKENED_URL}${route}`, {
      data: payload, // Axios requires 'data' to send body in DELETE
      headers: {
        'Content-Type': 'application/json' // or adjust as needed
      },
    });

    return {
      success: response.status === 200,
      response: response.data
    };
  } catch (error) {
    console.log("Error occurred:", error.message);
    return {
      success: false,
      message:"Something went wrong!"
    };
  }
};
