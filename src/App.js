import './App.css';
import Form from './components/Form';

function App() {
  return (
    <main>
      <nav>
        <h1 className="title">THINGS TO DO</h1>
        <div className="hero-section">
          <img
            className="cover"
            alt="cover"
            src="https://media1.giphy.com/media/PnbMbq2k4HNisBBJ9g/giphy.gif?cid=ecf05e47udofotphtcczlr3ngx5z97b11s1y6xohe5474w2l&ep=v1_gifs_search&rid=giphy.gif&ct=g"
          />
          <ul>
            <li>Write down your mission!</li>
            <li>play "add mission" to add the new one</li>
            <li>With one click "delete", BOOM!</li>
            <li>Can also check out the amount of missions left</li>
            <li>Let's start to list out missions today!</li>
          </ul>
        </div>
      </nav>
      <section className="section">
        <Form />
      </section>
    </main>
  );
}

export default App;
