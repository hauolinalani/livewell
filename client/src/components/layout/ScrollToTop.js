import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Function to scroll to the top of the page whenever we navigate
 */
function ScrollToTop({ history }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    }
  }, []);

  return (null);
}

export default withRouter(ScrollToTop);