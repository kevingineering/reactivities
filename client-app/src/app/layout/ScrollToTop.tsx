//code from https://reacttraining.com/react-router/web/guides/scroll-restoration


// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// export default function ScrollToTop() {
  //   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// }

import { useEffect } from "react"
import { withRouter } from "react-router-dom"

const ScrollToTop = ({ children, location: { pathname }}: any) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return children
}

export default withRouter(ScrollToTop)