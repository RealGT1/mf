import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./app.css";
import Resulttest from "../ResultsDisplay/Resulttest";

export default function Choice5({ initialselectedOptions }) {
  const initialQuestions = [
    {
      questionText: "Which type of investment are you most interested in?",
      answerOptions: [
        {
          answerText:
            "Stock Market Growth: Investing mainly in the Stocks to achieve higher growth, albeit with higher risk.",
          key: "option1",
        },
        {
          answerText:
            "Balanced Investment: Mixing stocks and bonds for a balance of growth and stability.",
          key: "option2",
        },
        {
          answerText:
            "Stable Income: Focusing on regular income with lower risk, often through bonds.",
          key: "option3",
        },
        {
          answerText:
            "Specialized Investments: Targeting specific sectors or themes within the market.",
          key: "option4",
        },
        {
          answerText:
            "Long-term Goals: Retirement or education savings, which often have a mix of growth and stability.",
          key: "option5",
        },
      ],
    },
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({ initialselectedOptions });
  const navigate = useNavigate();

  const nextQuestions = {
    option1: {
      questionText:
        "Which of the following investment strategies aligns most with your preferences?",
      answerOptions: [
        {
          answerText:
            "High Dividend Returns: Seeking regular income from high dividend-yielding stocks.", key: "a",
        },
        {
          answerText:
            "Market Trends: Following broader market indices or sectors.", key: "b",
        },
        {
          answerText:
            "Risk and Flexibility: Investing or shifting between across various markets based on market conditions.", key: "c",
        },
        { answerText: "Tax Efficiency: Looking for tax-saving options.", key: "d", },
        {
          answerText:
            "Value and Turnaround: Investing in undervalued or out-of-favor stocks with potential for growth.", key: "e",
        },
        {
          answerText:
            "Investment strategies for efficiency: arbitrage, ETFs, focused investing, or diversification", key: "f",
        },
      ],
    },
    option2: {
      questionText:
        "Considering your investment preferences, which type of hybrid fund would you prefer?",
      answerOptions: [
        {
          answerText:
            "Growth with Balance: Aiming for growth with a balanced approach.", key: "a",
        },
        {
          answerText:
            "Opportunistic Returns: Exploiting market price differences.", key: "b",
        },
        {
          answerText:
            "Adaptive Strategy: Adjusting allocation based on market conditions.", key: "c",
        },
        {
          answerText:
            "Preservation with Potential: Focusing on capital preservation with some growth potential.", key: "d",
        },
        {
          answerText: "Tax-efficient Growth: Seeking growth with tax benefits.", key: "e",
        },
        {
          answerText:
            "Aggressive Growth with Balance: Balancing growth potential with a more aggressive investment strategy.", key: "f",
        },
      ],
    },
    option3: {
      questionText:
        "You want to invest in a debt mutual fund based on your preference for risk and investment duration. Which of the following would you choose?",
      answerOptions: [
        { answerText: "Very low risk, suitable for short-term investments.", key: "a", },
        {
          answerText:
            "Low to moderate risk, suitable for medium-term investments.", key: "b",
        },
        {
          answerText:
            "Moderate to high risk, suitable for long-term investments.", key: "c",
        },
        {
          answerText:
            "Higher risk, focuses on corporate and banking bonds with higher returns.", key: "d",
        },
        {
          answerText:
            "Varying risk, adjusts based on market conditions or specific goals.", key: "e",
        },
      ],
    },
    option4: {
      questionText:
        "You want to invest based on your preference for risk, type of asset, and investment goals. Which of the following would you choose?",
      answerOptions: [
        {
          answerText:
            "Focuses on bonds and other debt instruments, generally lower risk.", key: "a",
        },
        {
          answerText:
            "Focuses on stocks, higher risk, potential for higher returns.", key: "b",
        },
        {
          answerText:
            "Invests in gold, can be used as a hedge against inflation.", key: "c",
        },
        {
          answerText:
            "Invests in a mix of assets, diversified portfolio, moderate risk.", key: "d",
        },
        { answerText: "Targets specific sectors or strategies, varying risk.", key: "e" },
      ],
    }
  };
  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  const handleAnswerButtonClick = (key) => {
    const nextQuestion = nextQuestions[key];

    if (nextQuestion) {
      setQuestions((prevQuestions) => [...prevQuestions, nextQuestion]);
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setShowScore(true);
      navigate('/result', { state: { selectedOptions } }); // Navigate to result page
    }

    setSelectedOptions((prevSelectedOptions) => ({
      ...prevSelectedOptions,
      [questions[currentQuestion].questionText]: key,
    }));
  };

  return (
    <div className="app">
      {showScore ? (
        <Resulttest selectedOptions={selectedOptions} />
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 5}</span>/{6}
            </div>
            <div className="question-text">
              <h2>{questions[currentQuestion].questionText}</h2>
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].answerOptions.map(
              (answerOption, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerButtonClick(answerOption.key)}
                >
                  {answerOption.answerText}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}