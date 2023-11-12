import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ChatContainer from "./components/ChatContainer/ChatContainer";
import Login from "./components/Auth/Login";

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<ChatContainer />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
