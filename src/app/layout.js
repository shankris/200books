import "./index.css";
import Header from "@/components/Layout/Header";
import Main from "@/components/Layout/Main";
// import Footer from "@/components/Layout/Footer"; // commented as requested
import Sidebar from "@/components/Layout/Sidebar/";

export const metadata = {
  title: "200Books",
  description: "A curated list of 200 must-read books",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar />
          <Main>{children}</Main>
        </div>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
