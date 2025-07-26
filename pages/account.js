import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddressComponent from "../components/AddressComponent";
import PasswordLoginSettings from "../components/PasswordLoginSettings";
import NotificationSettings from "../components/NotificationSettings";
// import IndividualVerificationForm from "@/components/IndividualVerificationForm"; 
// import CorporateVerificationForm from "@/components/CorporateVerificationForm"; 
// import PropertyVerificationForm from "@/components/PropertyVerificationForm";
// import VehicleVerificationForm from "@/components/VehicleVerificationForm"; 
import IdentityVerification from "../components/IdentityVerification";
import ProfileSection from "../components/ProfileSection"; // Adjust the path as needed

const AccountSettings = () => {
  const router = useRouter();
  const { tab } = router.query;

  const { data: session } = useSession();
  // Initialize with default, will be overridden by ?tab=
  const [activeSection, setActiveSection] = useState("profile");

  // If there's a `?tab=` in URL, switch to it
  useEffect(() => {
    if (tab) {
      // if you redirected with `?tab=identity_verification`, map that to "identity"
      const normalized = tab === "identity_verification" ? "identity" : tab;
      setActiveSection(normalized);
    }
  }, [tab]);

  // Define message and messageType state
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Profile data state
  const [profile, setProfile] = useState({
    email: "",
    phone: "",
    name: "",
    country_id: "",
    profile_pic: null,
      vat_number: "",       // Added new optional field
  company_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // Stores validation errors

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.token) return;
      setLoading(true);
      try {
        const response = await axios.get(
          "https://admin.xpertbid.com/api/account-settings",
          {
            headers: { Authorization: `Bearer ${session.user.token}` },
          }
        );
        setProfile(response.data.profile || {});
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  const saveProfile = async () => {
    setLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
  // 1) profile_pic explicitly
  if (profile.profile_pic instanceof File) {
    formData.append("profile_pic", profile.profile_pic);
  } else {
    formData.append("profile_pic", "/assets/images/profile/user.jpg");
  }

  // 2) append the rest, skipping profile_pic
  Object.entries(profile).forEach(([k, v]) => {
    if (k === "profile_pic") return;
    formData.append(k, v);
  });

console.log(formData);  
      const response = await axios.post(
        "https://admin.xpertbid.com/api/user/update",
        formData,
        {
          headers: { Authorization: `Bearer ${session.user.token}` },
        }
      );
      setMessage(response.data.message || "Profile updated successfully!");
      setMessageType("success");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        setMessage("Validation error. Please fix the issues.");
      } else {
        setMessage("An error occurred while updating your profile.");
      }
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="account-setting">
        <h2 className="ps-4 account-head">Account Settings</h2>
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-4 user-setting">
              <div className="setting">
                <h3>User Settings</h3>
                <ul className="userSettingsMenu">
                  <li>
                    <button
                      className={`profile-item ${
                        activeSection === "profile" ? "activee" : ""
                      }`}
                      onClick={() => setActiveSection("profile")}
                    >
                      My Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className={`profile-item ${
                        activeSection === "address" ? "activee" : ""
                      }`}
                      onClick={() => setActiveSection("address")}
                    >
                      Address
                    </button>
                  </li>
                  <li>
                    <button
                      className={`profile-item ${
                        activeSection === "notifications" ? "activee" : ""
                      }`}
                      onClick={() => setActiveSection("notifications")}
                    >
                      Notification Settings
                    </button>
                  </li>
                  <li>
                    <button
                      className={`profile-item ${
                        activeSection === "password" ? "activee" : ""
                      }`}
                      onClick={() => setActiveSection("password")}
                    >
                      Password & Login
                    </button>
                  </li>
                  <li>
                    <button
                      className={`profile-item ${
                        activeSection === "identity" ? "activee" : ""
                      }`}
                      onClick={() => setActiveSection("identity")}
                    >
                      Identity Verification
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Content Section */}
            <div className="col-lg-8 user-profile">
              {activeSection === "profile" && (
                <ProfileSection
                  profile={profile}
                  setProfile={setProfile}
                  saveProfile={saveProfile}
                  loading={loading}
                  errors={errors}
                  message={message}
                  messageType={messageType}
                />
              )}
              {activeSection === "address" && <AddressComponent />}
              {activeSection === "notifications" && <NotificationSettings />}
              {activeSection === "password" && <PasswordLoginSettings />}
              {activeSection === "identity" && <IdentityVerification />}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AccountSettings;
