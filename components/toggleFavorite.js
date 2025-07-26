// components/FavoriteIcon.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function FavoriteIcon({ auctionId, initialFavorite }) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const { data: session } = useSession();

  // Mount pe sirf ek dafa check karo
  useEffect(() => {
    if (!session) return;
    const checkFav = async () => {
      try {
        const { data } = await axios.post(
          "https://admin.xpertbid.com/api/favorites/check",
          { auction_id: auctionId, user_id: session.user.id },
          { headers: { Authorization: `Bearer ${session.user.token}` } }
        );
        setFavorite(!!data.success);
      } catch (err) {
        console.error("Favorite check error:", err);
      }
    };
    checkFav();
  }, [auctionId, session]);

  const handleToggle = async () => {
    if (!session) return;
    try {
      await axios.post(
        "https://admin.xpertbid.com/api/favorites/add",
        { auction_id: auctionId, user_id: session.user.id },
        { headers: { Authorization: `Bearer ${session.user.token}` } }
      );
      // Agar API ne bataya hata diya ya add kiya
      setFavorite(prev => !prev);
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  return (
    <button
      className="fav-btn"
      onClick={handleToggle}
      
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      {favorite ? (
        // Filled heart
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"  fill="red">
          <path
            d="M16.44 3.1001C14.63 3.1001 13.01 3.9801 12 5.3301C10.99 3.9801 9.37 3.1001 7.56 3.1001C4.49 3.1001 2 5.6001 2 8.6901C2 9.8801 2.19 10.9801 2.52 12.0001C4.1 17.0001 8.97 19.9901 11.38 20.8101C11.72 20.9301 12.28 20.9301 12.62 20.8101C15.03 19.9901 19.9 17.0001 21.48 12.0001C21.81 10.9801 22 9.8801 22 8.6901C22 5.6001 19.51 3.1001 16.44 3.1001Z"
          />
        </svg>
      ) : (
        // Outline heart
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z"
            stroke="#23262F"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
