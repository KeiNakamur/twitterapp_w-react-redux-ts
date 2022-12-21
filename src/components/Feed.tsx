import React from "react";
import { auth } from "../firebase";

const Feed = () => {
  return (
    <div>
      {/* firebaseのSignOut */}
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
};

export default Feed;
