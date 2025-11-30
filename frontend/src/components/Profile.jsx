import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated) return navigate("/login");

    fetch(`${API_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then(setProfile);
  }, [isAuthenticated]);

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>

      {!profile ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>User ID:</strong> {profile.id}</p>
          <p><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
