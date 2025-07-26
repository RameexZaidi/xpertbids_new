import { useState, useEffect } from "react";
import axios from "axios";

const ProfileImage = ({ user }) => {
  const [profileImage, setProfileImage] = useState(user?.profile_image || "/assets/images/default-avatar.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.profile_image) {
      setProfileImage(user.profile_image);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("profile_image", selectedFile);

    try {
      const response = await axios.post(
        "https://admin.xpertbid.com/api/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setProfileImage(response.data.profile_image); // Update with backend response
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading profile image:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-image-container">
      <div className="image-preview">
        <img src={profileImage} alt="Profile" className="profile-img" />
      </div>

      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="profileUpload" />
      <label htmlFor="profileUpload" className="upload-btn">Choose Image</label>

      {selectedFile && (
        <button onClick={handleUpload} className="upload-btn" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default ProfileImage;
