import Sidebar from "../Sidebar/Sidebar";
import ChatWindow from "../Chat/ChatWindow";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default Dashboard;
