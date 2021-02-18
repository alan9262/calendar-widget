import logo from './logo.svg';
import './App.css';
import Calender from './components/Calendar';

function App() {
  const calendarStyle = {
    position: "relative",
    margin: "50px auto"
  }
  return (
    <div className="App">
      <Calender style={calendarStyle}/>
    </div>
  );
}

export default App;
