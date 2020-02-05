// 3rd Party Packages
import React from 'react';

// Custom Components
import Autosearch from "./components/Autosearch";

// CSS
import './App.css';

function App() {
  return (
    <div className="searchWrapper">
      <Autosearch class="flora" />
      <Autosearch class="city" />
    </div>

  );
}

export default App;
