import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import Layout from '../Graph/components/Layout';
import ChartWrapper from '../Graph/components/ChartWrapper';

const FundDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fund } = location.state || {};

    if (!fund) {
        return <div>No fund details available. <button onClick={() => navigate(-1)}>Go Back</button></div>;
    }

    return (
        <div >
            <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-8 w-auto"
                                src={logo}
                                alt="Logo"
                            />
                        </a>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Wealthify</span>
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            Get started
                        </button>
                        <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            <li>
                                <a href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                            </li>
                            <li>
                                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
                            </li>
                            <li>
                                <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>



            <div className="container mx-auto px-4 py-8 mt-12">
                <div className=" shadow-md rounded-lg p-6 bg-green-50">
                    <h2 className="text-2xl font-bold mb-4">{fund.name}</h2>
                </div>

                <div>
                    <ChartWrapper />
                    <p className="text-lg font-semibold mb-2">Investment Objective</p>
                    <p>{fund.investment_objective}</p>
                </div>
                {/* Boxes for additional fund details */}
                <div className="flex flex-row space-x-4 mt-8">
                    {/* Box 1: NAV Date and NAV Value */}
                    <div className="bg-green-50 shadow-md rounded-lg p-6 flex-1">
                        <h3 className="text-lg font-semibold mb-2">NAV Date and NAV Value</h3>
                        <p><strong>NAV Date:</strong> {fund.nav_date}</p>
                        <p><strong>NAV Value:</strong> {fund.nav_value}</p>
                    </div>
                    {/* Box 2: Fund Manager */}
                    <div className="bg-white shadow-md rounded-lg p-6 flex-1">
                        <h3 className="text-lg font-semibold mb-2">Fund Manager</h3>
                        <p> {fund.fund_manager}</p>
                    </div>
                    {/* Box 3: Returns */}
                    <div className="bg-green-50 shadow-md rounded-lg p-6 flex-1">
                        <h3 className="text-lg font-semibold mb-2">Returns</h3>
                        <p><strong>1 Year Return:</strong> {fund.returns.year_1}%</p>
                        <p><strong>3 Year Return:</strong> {fund.returns.year_3}%</p>
                        <p><strong>5 Year Return:</strong> {fund.returns.year_5}%</p>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default FundDetails;
