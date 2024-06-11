import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FundDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fund } = location.state || {};

    if (!fund) {
        return <div>No fund details available. <button onClick={() => navigate(-1)}>Go Back</button></div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">{fund.name}</h2>
                <p><strong>ISIN:</strong> {fund.isin}</p>
                <p><strong>CRISIL Rating:</strong> {fund.crisil_rating}</p>
                <p><strong>Category:</strong> {fund.fund_category}</p>
                <p><strong>Manager:</strong> {fund.fund_manager}</p>
                <p><strong>Type:</strong> {fund.fund_type}</p>
                <p><strong>NAV Date:</strong> {fund.nav_date}</p>
                <p><strong>NAV Value:</strong> {fund.nav_value}</p>
                <p><strong>1 Year Return:</strong> {fund.returns.year_1}%</p>
                <p><strong>3 Year Return:</strong> {fund.returns.year_3}%</p>
                <p><strong>5 Year Return:</strong> {fund.returns.year_5}%</p>
                <p><strong>Fund Code:</strong> {fund.code}</p>
                <p><strong>Expense Ratio:</strong> {fund.expense_ratio}</p>
            </div>
        </div>
    );
};

export default FundDetails;
