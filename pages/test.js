import axios from "axios";
import { useRouter } from "next/router";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

export default function Login() {
 
  const router = useRouter();


  const handleGoogleLogin = async (credentialToken) => {
    try {
      const res = await axios.post("https://admin.xpertbid.com/api/google-login", {
        token: credentialToken,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/userDashboard");
    } catch (error) {
      console.error("Google login failed", error.response?.data || error.message);
    }
  };

  return (
    
      <GoogleOAuthProvider clientId="971421469748-k1qicbfj8298bb9notpe8cfijcvf9t40.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const token = credentialResponse.credential;
            if (token) handleGoogleLogin(token);
          }}
          onError={() => {
            console.error("Google Sign-In Failed");
          }}
        />
      </GoogleOAuthProvider>
   
  );
}
