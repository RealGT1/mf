import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage/HomePage'
import Questions from './components/Questions/Questions'
import Layout from "./components/Graph/components/Layout";
import ChartWrapper from "./components/Graph/components/ChartWrapper";
import FundDetails from './components/ResultsDisplay/FundDetails';
import Resulttest from './components/ResultsDisplay/Resulttest';


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/questions' element={<Questions />} />
        <Route path="/result" element={<Resulttest />} />
        <Route path="/fund/:isin" element={<FundDetails />} />
      </Routes>
    </div>
  )
}

export default App
