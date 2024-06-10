import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from '../Graph/components/Layout';
import ScaleLoader from 'react-spinners/ScaleLoader';

const FundDetails = () => {
    const { isin } = useParams();
    const [fund, setFund] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFundDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/fund/${isin}`);
                console.log('Fetched fund details:', response.data); // Debug log
                if (response.data && response.data.length > 0) {
                    setFund(response.data[0]); // Set the first element of the array as fund
                    setLoading(false);
                } else {
                    setError('No fund data available.');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error fetching fund details:', error); // Debug log
                setError('Failed to fetch fund details. Please try again.');
                setLoading(false);
            }
        };

        fetchFundDetails();
    }, [isin]);


    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>

                <ScaleLoader color="#36d7b7" />
            </div>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!fund) {
        return <div>No fund data available.</div>;
    }

    return (

        <div className="fund-details">
            <h1>{fund.name}</h1>
            <p><strong>CRISIL Rating:</strong> {fund.crisil_rating}</p>
            <p><strong>Category:</strong> {fund.fund_category}</p>
            <p><strong>Manager:</strong> {fund.fund_manager}</p>
            <p><strong>Type:</strong> {fund.fund_type}</p>
            <p><strong>NAV Date:</strong> {fund.nav.date}</p>
            <p><strong>NAV Value:</strong> {fund.nav.nav}</p>
            <p><strong>1 Year Return:</strong> {fund.returns ? fund.returns.year_1 : 'N/A'}%</p>
            <p><strong>3 Year Return:</strong> {fund.returns ? fund.returns.year_3 : 'N/A'}%</p>
            <p><strong>5 Year Return:</strong> {fund.returns ? fund.returns.year_5 : 'N/A'}%</p>
            {/* Add more details as needed */}
        </div>
    );
};

export default FundDetails;
