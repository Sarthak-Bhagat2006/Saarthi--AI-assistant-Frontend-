import { useEffect, useState } from "react";

function UserInfo() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setUser(user);
    } catch {
      setUser(null);
    }
  }, []);

  if (!user) return null;

  return (
    <div className="user-info">
      <div className="avatar">
        <i className="fa-solid fa-user"></i>
      </div>

      <span>{user.role === "guest" ? "Guest" : user.email}</span>
    </div>
  );
}

export default UserInfo;
