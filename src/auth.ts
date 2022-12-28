import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];

    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, 'RANDOM_TOKEN_SECRET');

    // retrieve the user details of the logged in user
    const {login} = await decodedToken;

    // pass the user down to the endpoints here
    request.login = login;

    // pass down functionality to the endpoint
    next();
    
  } catch (error) {
    response.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};

export default auth;