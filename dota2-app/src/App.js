// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MatchDetail from './components/MatchDetail';

function App() {
  return (
      <Router>
        <div className="App">
          <Switch>
            <Route
                path="/match/:matchId"
                render={(props) => <MatchDetail matchId={props.match.params.matchId} />}
            />
            {/* Добавьте другие маршруты */}
          </Switch>
        </div>
      </Router>
  );
}

export default App;
