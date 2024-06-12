from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import asyncio
import aiohttp
from sklearn.preprocessing import MinMaxScaler
import numpy as np

app = Flask(__name__)
CORS(app)

# In-memory cache to store top 5 funds details
top_5_funds_cache = []

async def fetch_data(session, isin):
    try:
        async with session.get(f'https://mf.captnemo.in/kuvera/{isin}', timeout=aiohttp.ClientTimeout(total=10)) as response:
            if response.status == 200:
                data = await response.json()
                if isinstance(data, list) and data:
                    item = data[0]
                    code = item.get('code', 'N/A')
                    name = item.get('name', 'N/A')
                    fund_category = item.get('fund_category', 'N/A')
                    nav_value = item['nav']['nav'] if 'nav' in item else 'N/A'
                    nav_date = item['nav']['date'] if 'nav' in item else 'N/A'
                    volatility = item.get('volatility', 'N/A')
                    returns = item.get('returns', {
                        "week_1": "N/A",
                        "year_1": "N/A",
                        "year_3": "N/A",
                        "year_5": "N/A",
                        "inception": "N/A",
                        "date": "N/A"
                    })
                    expense_ratio = item.get('expense_ratio', 'N/A')
                    aum = item.get('aum', 'N/A')
                    portfolio_turnover = item.get('portfolio_turnover', 'N/A')
                    fund_type = item.get('fund_type', 'N/A')
                    plan = item.get('plan', 'N/A')
                    fund_manager = item.get('fund_manager', 'N/A')
                    crisil_rating = item.get('crisil_rating', 'N/A')
                    investment_objective = item.get('investment_objective', 'N/A')
                    maturity_type = item.get('maturity_type', 'N/A')
                    return (isin, code, name, fund_category, nav_value, nav_date, volatility, returns, expense_ratio, aum, portfolio_turnover, fund_type, plan, fund_manager, crisil_rating, investment_objective, maturity_type)
            return None
    except asyncio.TimeoutError:
        return None
    except aiohttp.ClientError as e:
        print(f'Client error occurred for ISIN: {isin}, Error: {e}')
        return None

async def fetch_all_data(isin_numbers):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(session, isin) for isin in isin_numbers]
        results = await asyncio.gather(*tasks)
        successful_responses = [result for result in results if result and result[1] != 'Error']
        failed_responses = len(isin_numbers) - len(successful_responses)
        print(f'Number of Successful responses: {len(successful_responses)}')
        print(f'Number of failed responses: {failed_responses}')
        return successful_responses

def determine_category_subcategory(selectedOptions):
    category_map = {
        'option1': 'Growth/Equity Oriented Schemes',
        'option2': 'Hybrid Schemes',
        'option3': 'Income/Debt Oriented Schemes',
        'option4': 'Other Schemes',
        'option5': 'Solution Oriented Schemes',
    }
    
    subcategory_map = {
        'option1': {
            'a': 'Dividend Yield Fund',
            'b': 'Equity Index Funds, Sectoral Fund, Thematic Fund',
            'c': 'Small Cap Fund, Mid Cap Fund, Large Cap Fund, Multi Cap Fund, Flexi Cap Fund, Dynamic Asset Allocation',
            'd': 'ELSS',
            'e': 'Value Fund, Contra Fund',
            'f': 'Arbitrage Fund, Equity Exchange Traded Funds, Focused Fund, Fund of Funds, Multi Asset Allocation',
        },
        'option2': {
            'a': 'Balanced Fund, Balanced Advantage',
            'b': 'Arbitrage Fund',
            'c': 'Dynamic Asset Allocation, Multi Asset Allocation',
            'd': 'Conservative Hybrid Fund',
            'e': 'Equity Savings Fund',
            'f': 'Aggressive Hybrid Fund',
        },
        'option3': {
            'a': 'Liquid, Overnight, Money Market',
            'b': 'Short Duration, Ultra Short Duration, Low Duration, Medium Duration, Floater',
            'c': 'Long Duration Fund, Gilt, Gilt with 10-year duration, Medium to Long Duration Fund',
            'd': 'Corporate Bond, Credit Risk, Banking and PSU Debt Fund',
            'e': 'Capital Protection Oriented Schemes, Fixed Term Plan, Interval Schemes as there is no sub-category,Dynamic Bond, Debt Exchange Traded Funds, Debt Index Funds,Gold Exchange Traded Funds',
        },
        'option4': {
            'a': 'Liquid Fund, Debt Exchange Traded Funds, Debt Index Funds, Fixed Term Plan',
            'b': 'Equity Exchange Traded Funds, Equity Index Funds, Thematic Fund',
            'c': 'Gold Exchange Traded Funds',
            'd': 'Fund of Funds (Domestic),Fund of Funds investing overseas',
            'e': 'Other Exchange Traded Funds, Other Index Funds',
        },
        'option5': 'Children\'s Fund, Retirement Fund',
    }

    # Use the actual keys from the frontend
    if selectedOptions['Which type of investment are you most interested in?'] == 'option5':
        return 'Solution Oriented Schemes', 'Children\'s Fund, Retirement Fund'
    category = category_map.get(selectedOptions['Which type of investment are you most interested in?'])
    subcategory = subcategory_map.get(selectedOptions['Which type of investment are you most interested in?'], {}).get(selectedOptions.get('Which of the following investment strategies aligns most with your preferences?'), '')

    return category, subcategory


@app.route('/api/recommend', methods=['POST'])
def recommend():
    global top_5_funds_cache

    selectedOptions = request.json
    print('Selected Options:', selectedOptions)
    category, subcategory = determine_category_subcategory(selectedOptions)

    print('Category:', category)
    print('Subcategory:', subcategory)

    df = pd.read_excel('./Mutual Fund_ISIN_Details.xlsx')
    print('Total rows in DataFrame:', len(df))

    filtered_df = df[(df.iloc[:, 7] == category)]
    print('Rows after category filtering:', len(filtered_df))

    if category != 'Solution Oriented Schemes':
        subcategories = [sub.strip() for sub in subcategory.split(',')]
        filtered_df = filtered_df[
            filtered_df.iloc[:, 8].apply(lambda x: any(sub in x for sub in subcategories))
        ]

    print('Rows after subcategory filtering:', len(filtered_df))
    isin_numbers = filtered_df.iloc[:, 1].tolist()
    print('ISIN numbers:', isin_numbers)
    print('Number of ISIN numbers:', len(isin_numbers))

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    combined_data = loop.run_until_complete(fetch_all_data(isin_numbers))

    if not combined_data:
        print('No successful responses received.')
        return jsonify({'error': 'No successful responses received.'}), 500

    columns = ['isin', 'code', 'name', 'fund_category', 'nav_value', 'nav_date', 'volatility', 'returns', 'expense_ratio', 'aum', 'portfolio_turnover', 'fund_type', 'plan', 'fund_manager', 'crisil_rating', 'investment_objective', 'maturity_type']
    df_combined = pd.DataFrame(combined_data, columns=columns)

    if df_combined.empty:
        print('Combined DataFrame is empty after fetching data.')
        return jsonify({'error': 'No valid data to process.'}), 500

    df_combined['returns_5_year'] = pd.to_numeric(df_combined['returns'].apply(lambda x: x.get('year_5', np.nan)), errors='coerce')
    df_combined['returns_3_year'] = pd.to_numeric(df_combined['returns'].apply(lambda x: x.get('year_3', np.nan)), errors='coerce')
    df_combined['returns_1_year'] = pd.to_numeric(df_combined['returns'].apply(lambda x: x.get('year_1', np.nan)), errors='coerce')

    scaler = MinMaxScaler()

    df_combined['volatility'] = scaler.fit_transform(df_combined[['volatility']].astype(float))
    df_combined['expense_ratio'] = scaler.fit_transform(df_combined[['expense_ratio']].astype(float))
    df_combined['aum'] = scaler.fit_transform(df_combined[['aum']].astype(float))
    df_combined['portfolio_turnover'] = scaler.fit_transform(df_combined[['portfolio_turnover']].astype(float))

    df_combined['volatility'] = 1 - df_combined['volatility']
    df_combined['expense_ratio'] = 1 - df_combined['expense_ratio']

    df_combined['return_score'] = (0.5 * df_combined['returns_5_year'].fillna(0) + 0.3 * df_combined['returns_3_year'].fillna(0) + 0.2 * df_combined['returns_1_year'].fillna(0))
    df_combined['return_score'] = scaler.fit_transform(df_combined[['return_score']])

    df_combined['final_score'] = 0.4 * df_combined['return_score'] + 0.3 * df_combined['volatility'] + 0.2 * df_combined['expense_ratio'] + 0.1 * df_combined['aum']

    top_5_funds = df_combined.nlargest(5, 'final_score')

    top_5_funds_list = top_5_funds[['isin', 'code', 'name', 'final_score', 'fund_category', 'nav_value', 'returns', 'nav_date', 'expense_ratio', 'fund_type', 'plan', 'fund_manager', 'crisil_rating', 'investment_objective', 'maturity_type']].to_dict(orient='records')
    
    top_5_funds_cache = top_5_funds.to_dict(orient='records')

    return jsonify(top_5_funds_list)


if __name__ == '__main__':
    app.run(debug=True)
