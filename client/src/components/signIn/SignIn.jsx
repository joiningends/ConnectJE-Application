import { useState, useEffect } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import loginImage from "../../assets/loginImage.jpg";
import joiningEndsLogo from "../../assets/JoiningEndsLogo.png";
import axios from "../../axiosSetup";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fbLoaded, setFbLoaded] = useState(true);

  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: "1306662293909245",
          cookie: true,
          xfbml: true,
          version: "v17.0",
        });
        setFbLoaded(true);
      };

      (function (d, s, id) {
        if (d.getElementById(id)) return;
        const js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        const fjs = d.getElementsByTagName(s)[0];
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    };

    loadFacebookSDK();
  }, []);

  const handleFBLogin = event => {
    event.preventDefault();
    if (!fbLoaded || !window.FB) {
      console.log("Facebook SDK not loaded yet.");
      return;
    }

    window.FB.login(
      response => {
        if (response.status === "connected") {
          console.log(response.authResponse);
          const { accessToken, userID } = response.authResponse;
          console.log("User ID:", userID, "Access Token:", accessToken);
          localStorage.setItem("facebookToken", accessToken);
          facebookLogin(accessToken);
        } else {
          console.log("User not authenticated with Facebook.");
          alert(
            "This app needs at least one supported permission for Facebook Login."
          );
        }
      },
      { scope: "public_profile,email,pages_show_list,ads_read" }
    );
  };

  const facebookLogin = async accessToken => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/v1/facebook/facebook-login",
        { accessToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;
      console.log("hi", data);

      localStorage.setItem("whatsappusertoken", data.token);
      localStorage.setItem("whatsappusertype", data.role);
      localStorage.setItem("isLoggedIn", "true");

      if (data.role === "user") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/WAprofile";
      } else if (data.role === "admin") {
        window.location.href = "/allCustomers";
      } else if (data.role === "Sales Marketing") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/Event";
      } else if (data.role === "Scanner") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/EventScanner";
      } else if (data.role === "Optometrist") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/Scan";
      } else if (data.role === "Partner") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/Event";
      } else {
        alert("Invalid role");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/users/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      localStorage.setItem("whatsappusertype", data.role);
      localStorage.setItem("whatsappusertoken", data.token);
      localStorage.setItem("isLoggedIn", "true");

      if (data.role === "user") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/WAprofile";
      } else if (data.role === "admin") {
        window.location.href = "/allCustomers";
      } else if (data.role === "Sales Marketing") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/Event";
      } else if (data.role === "Scanner") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/EventScanner";
      } else if (data.role === "Optometrist") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/Scan";
      } else if (data.role === "Partner") {
        localStorage.setItem("whatsappuserId", data.userId);
        window.location.href = "/Event";
      } else {
        alert("Invalid role");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed");
    }
  };

  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="flex-grow flex items-center justify-center"
        style={{
          backgroundClip: "padding-box",
          backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
          borderRadius: "2rem",
        }}
      >
        <div className="h-5/6 grid grid-cols-1 lg:grid-cols-2 shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white rounded-l-lg space-y-8">
            <img src={joiningEndsLogo} alt="Logo" style={{ width: "14rem" }} />
            <div
              className="w-full max-w-md space-y-6"
              style={{ marginTop: "-1rem" }}
            >
              <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Sign in
              </h2>
              <p className="text-lg text-gray-600">
                Sign in to access your account and enjoy personalized services.
              </p>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-lg font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div>
                    <input
                      id="email"
                      className="flex h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#512da8] focus:ring-offset-2"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-lg font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <a
                      href="forgotPassword"
                      className="text-base font-semibold text-[#512da8] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      className="flex h-12 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#512da8] focus:ring-offset-2 pr-10"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#512da8] px-4 py-3 font-semibold leading-6 text-white hover:bg-[#512da8]/90"
                    onClick={handleLogin}
                  >
                    Get started <ArrowRight className="ml-2" size={24} />
                  </button>
                </div>
                {fbLoaded && (
                  <div>
                    <button
                      className="inline-flex w-full items-center justify-center rounded-md bg-[#1877F2] px-4 py-3 font-semibold leading-6 text-white hover:bg-[#1877F2]/90"
                      onClick={handleFBLogin}
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Continue with Facebook
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="h-full p-8 lg:p-12 text-white rounded-l-[20%] rounded-r-[5%] flex items-center justify-center">
            <img
              src={loginImage}
              style={{ mixBlendMode: "darken" }}
              alt="Sign in image"
              className="max-w-full"
            />
          </div>
        </div>
      </section>

      {/* New Footer */}
      <footer className="bg-white text-[#B197FC] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center space-x-6">
            <Link
              to="/AboutUs"
              className="hover:text-[#9f7bfc] transition-colors duration-300"
            >
              About Us
            </Link>
            <Link
              to="/ContactUs"
              className="hover:text-[#9f7bfc] transition-colors duration-300"
            >
              Contact Us
            </Link>
            <Link
              to="/ConnectJe_PrivacyPolicy"
              className="hover:text-[#9f7bfc] transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/ConnectJe_TermsAndConditions"
              className="hover:text-[#9f7bfc] transition-colors duration-300"
            >
              Terms and Conditions
            </Link>
            <Link
              to="/CancellationAndRefundPolicy"
              className="hover:text-[#9f7bfc] transition-colors duration-300"
            >
              Cancellation And Refund Policy
            </Link>
          </div>
          <div className="text-center mt-4">
            <p>
              &copy; {new Date().getFullYear()} JoiningEnds All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
