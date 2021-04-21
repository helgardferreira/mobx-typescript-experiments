import { Component } from "react";
// import DecoratorsExample from "./components/DecoratorsExample";
import Podcast from "./components/podcast/podcast.component";

class App extends Component {
  render() {
    return (
      <div>
        {/* <DecoratorsExample /> */}
        <Podcast />
      </div>
    );
  }
}

export default App;
