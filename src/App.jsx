import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import AuthScreen from "./components/Auth";
import ChatContainer from "./components/ChatContainer/ChatContainer";
import HomePage from "./components/Home/HomePage";

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* <=== Auth screen ===> */}
          <Route path="/login" element={<AuthScreen />} />
          <Route path="/register" element={<AuthScreen />} />
          <Route path="/forgot-password" element={<AuthScreen />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
