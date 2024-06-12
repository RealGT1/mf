import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HashLoader from 'react-spinners/HashLoader';
import { useNavigate, useLocation } from 'react-router-dom';
import "./results.css";

const Resulttest = () => {
  const location = useLocation();
  const { selectedOptions } = location.state || {};
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = localStorage.getItem('results');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
      setLoading(false);
    } else {
      const fetchResults = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:5000/api/recommend', selectedOptions);
          console.log('Fetched recommendations:', response.data);
          setResults(response.data);
          localStorage.setItem('results', JSON.stringify(response.data));
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch recommendations. Please try again.');
          setLoading(false);
        }
      };

      if (selectedOptions) {
        fetchResults();
      } else {
        setError('No selected options provided.');
        setLoading(false);
      }
    }
  }, [selectedOptions]);

  const handleClearAndAskAgain = () => {
    localStorage.removeItem('results');
    navigate('/questions'); // Change '/input' to the route where users input their preferences
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
      }}>
        <div style={{ marginRight: '20px' }}>
          <HashLoader color="#36d7b7" />
        </div>
        Finding the best funds for you...
      </div>
    );
  }


  if (error) {
    return <div>{error}</div>;
  }

  const handleFundClick = (fund) => {
    navigate(`/fund/${fund.isin}`, { state: { fund } });
  };

  return (
    <section className="text-gray-600 body-font bg-slate-100 pb-16">
      <div className="container px-9 mx-auto">
        <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
          <div className="lg:w-1/2 leading-relaxed text-green-700 font-extrabold pt-9 text-2xl pb-0">
            Here are the top 5 recommended funds based on your preferences.
          </div>
          <button
            onClick={handleClearAndAskAgain}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Clear and Ask Again
          </button>
        </div>
        <div className="flex flex-wrap -m-4">
          {results.map((fund) => (
            <div key={fund.isin} className="xl:w-1/3 md:w-1/2 p-4">
              <div onClick={() => handleFundClick(fund)} className="border border-gray-200 p-6 rounded-lg card-container bg-white cursor-pointer">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-green-100 text-green-500 mb-4">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">{fund.name}</h2>
                <p className="leading-relaxed text-base"><strong>CRISIL Rating:</strong> {fund.crisil_rating}</p>
                <p className="leading-relaxed text-base"><strong>Category:</strong> {fund.fund_category}</p>
                <p className="leading-relaxed text-base"><strong>Manager:</strong> {fund.fund_manager}</p>
                <p className="leading-relaxed text-base"><strong>Type:</strong> {fund.fund_type}</p>
                <p className="leading-relaxed text-base"><strong>NAV Date:</strong> {fund.nav_date}</p>
                <p className="leading-relaxed text-base"><strong>NAV Value:</strong> {fund.nav_value}</p>
                <p className="leading-relaxed text-base"><strong>1 Year Return:</strong> {fund.returns.year_1}%</p>
                <p className="leading-relaxed text-base"><strong>3 Year Return:</strong> {fund.returns.year_3}%</p>
                <p className="leading-relaxed text-base"><strong>5 Year Return:</strong> {fund.returns.year_5}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resulttest;
