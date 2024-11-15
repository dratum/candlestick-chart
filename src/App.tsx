import "./App.css";
import { Layout } from "antd";
import Header from "./components/Header";
import Chart from "./components/Chart";
import { ThemeConfigProvider } from "./contexts/ThemeConfigProvider";
import { ValueConfigProvider } from "./contexts/ValueConfigPairAndTimeframe";

function App() {
  const { Content } = Layout;

  return (
    <ThemeConfigProvider>
      <Layout>
        <ValueConfigProvider>
          <Header />
          <Content className='content'>
            <Chart />
          </Content>
        </ValueConfigProvider>
      </Layout>
    </ThemeConfigProvider>
  );
}

export default App;
