import "./index.css";
import Header from "@/components/Layout/Header";
import Main from "@/components/Layout/Main";
import Footer from "@/components/Layout/Footer";

export const metadata = {
  title: "200Books",
  description: "A curated list of 200 must-read books",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <Main>{children}</Main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
