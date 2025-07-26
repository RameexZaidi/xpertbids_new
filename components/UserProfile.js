import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // Import NextAuth session hook
import axios from "axios";
import { Oval } from "react-loader-spinner"; // Import the Oval loader

const UserProfile = () => {
  const { data: session } = useSession(); // Get the logged-in user's session
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true); // Loader state

  useEffect(() => {
    if (!session?.user?.id) return; // If no user is logged in, do nothing

    axios
      .get(`https://admin.xpertbid.com/api/get-image`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      })
      .then((response) => {
       // console.log(response.data);
        setUser(response.data);
        setImageLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setError("Failed to load user data.");
      })
      
  }, [session]); // Fetch user data when session ID is available

  if (!session) return <p>Please log in to view your profile.</p>;
  if (error) return <p>{error}</p>;

  // Profile Image Logic (Fix Google Image Issue)
  const defaultProfileImage = "/assets/images/user.jpg"; // Ensure this exists inside the public folder

  const profileImage =
    user?.profile_pic && user.profile_pic.trim() !== ""
      ? user.profile_pic.startsWith("https")
        ? user.profile_pic // External URL
        : `https://admin.xpertbid.com/${user.profile_pic}` // Local upload
      : defaultProfileImage; // Fallback if profile_pic is missing or empty

  return (
    <div className="profile-container">
      {imageLoading ? (
        <div className="loader-container">
          <Oval height={30} width={30} color="#3498db" secondaryColor="#f3f3f3" ariaLabel="loading-indicator" />
        </div>
      ) : (
        <img
          src={profileImage}
          onError={(e) => {
            e.target.src = defaultProfileImage;
          }} // Ensures fallback if the image fails to load
          alt={user?.name || "User Profile"}
          style={{ width: "30px", height: "30px", objectFit: "cover" }}
        />
      )}
    </div>
  );
};

export default UserProfile;
