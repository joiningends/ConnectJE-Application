import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const FacebookLoginButtonNew = () => {
  const responseFacebook = response => {
    console.log(response);
    // Handle the response from Facebook here
    if (response.status !== "unknown") {
      // Successful login actions
      console.log(
        "User ID:",
        response.userID,
        "Access Token:",
        response.accessToken
      );
      window.location.href = "/facebook-logged-in";
    } else {
      console.log("User not authenticated with Facebook.");
    }
  };

  return (
    <FacebookLogin
      appId={1306662293909245} // Ensure this environment variable is set
      autoLoad={false} // Prevents automatic login attempts
      fields="name,email,picture" // Specify the fields you want to access
      scope="pages_show_list,ads_read" // Specify the permissions your app requires
      callback={responseFacebook} // Function to handle the response
      render={renderProps => (
        <button
          onClick={renderProps.onClick}
          className="btn btn-primary btn-lg btn-block"
        >
          <i className="fab fa-facebook pr-2"></i> Login with Facebook
        </button>
      )}
    />
  );
};

export default FacebookLoginButton;
