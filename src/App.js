import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import Router from "./routes";
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import ScrollToTop from "./components/ScrollToTop";
import { BaseOptionChartStyle } from "./components/charts/BaseOptionChart";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeConfig>
        <ScrollToTop />
        <GlobalStyles />
        <BaseOptionChartStyle />
        <Router />
        <ToastContainer />
      </ThemeConfig>
    </ErrorBoundary>
  );
}
