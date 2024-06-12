import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./app.css";
import Choice5 from "./Choice5";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Test() {


  const initialQuestions = [
    {
      questionText: "Please Select your Age Group:",
      answerOptions: [
        { answerText: "Less than 25", isCorrect: false, key: "op1" },
        { answerText: "25-35", isCorrect: false, key: "op2" },
        { answerText: "35-45", isCorrect: true, key: "op3" },
        { answerText: "45-55", isCorrect: false, key: "op4" },
        { answerText: "More than 55", isCorrect: false, key: "op5" },
      ],
    },
    {
      questionText: "How much do you earn per month?",
      answerOptions: [
        { answerText: "Less than 20k", isCorrect: false, key: "op1" },
        { answerText: "Less than 50k", isCorrect: true, key: "op2" },
        { answerText: "Less than 1Lakh", isCorrect: false, key: "op3" },
        { answerText: "More than 1 Lakh", isCorrect: false, key: "op4" },
      ],
    },
    {
      questionText: "How much are you planning to invest per month?",
      answerOptions: [
        { answerText: "Less than 1000 per month", isCorrect: true, key: "op1" },
        { answerText: "1000-5000 per month", isCorrect: false, key: "op2" },
        { answerText: "5000-10000 per month", isCorrect: false, key: "op3" },
        {
          answerText: "More than 10000 per month",
          isCorrect: false,
          key: "op4",
        },
      ],
    },
    {
      questionText: "What is your Investment Horizon?",
      answerOptions: [
        { answerText: "Less than 1 year", isCorrect: false, key: "op1" },
        { answerText: "1-3 years", isCorrect: false, key: "op2" },
        { answerText: "3-5 years", isCorrect: false, key: "op3" },
        { answerText: "More than 5 years", isCorrect: true, key: "op4" },
      ],
    },

  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showChoice5, setShowChoice5] = useState(false);

  const navigate = useNavigate();

  const handleAnswerButtonClick = (key) => {
    if (currentQuestion < 3) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else if (currentQuestion === 3) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setShowChoice5(true);
    } else {
      navigate('/result', { state: { selectedOptions } }); // Navigate to result page
    }
  };

  return (
    <div className="app">
      {showChoice5 ? (
        <Choice5 />
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span><Link to={"/"}><ArrowBackIcon /></Link></span>
              <span>Question {currentQuestion + 1}</span>/{6}

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