# Stock-Market-Analysis-Assistant-
An interactive web app for analysing stock data. Search tickers to view company profiles, key metrics, and a 30-day price chart powered by Chart.js. Built with vanilla JS &amp; Tailwind CSS, this project is ready for a live API to provide real-time financial insights.
Stock Analysis Bot
A clean, responsive, and user-friendly web application to fetch and display real-time and historical stock market data. This project is designed to showcase front-end development skills using HTML, Tailwind CSS, and vanilla JavaScript, integrated with a third-party API for data and a charting library for visualisation.

🌟 Features
This project is currently fully functional using mock data, allowing for complete UI and feature testing.

Modern & Responsive UI: Built with Tailwind CSS for a professional look that works seamlessly on desktop, tablets, and mobile devices.

Stock Ticker Search: Users can input a stock ticker symbol to fetch relevant data.

Dynamic Data Display: The interface is populated dynamically with the fetched stock information, including:

Company Profile (Logo, Name, Ticker, Exchange, Industry)

Key Financial Metrics (Current Price, Day High, Day Low, Previous Close)

Interactive Price Chart: Historical stock prices for the last 30 days are visualised in an elegant line chart, powered by Chart.js.

User-Friendly Feedback: Includes a loading spinner during data fetching and clear error messages for invalid inputs or other issues.

Modular JavaScript: The code is well-commented and structured, separating DOM manipulation, data fetching logic, and event handling for easy maintenance.

🛠️ Current Status
The application is 99% complete. All front-end components, logic, and UI states are fully implemented and can be demonstrated by searching for the mock ticker "AAPL". The core application logic is robust and ready for production.

🚀 Next Steps: Activating Live Data
The final step is to replace the mock data function with a live API call to the Finnhub API.

Get a Free API Key: Sign up at Finnhub.io to get your free API key.

Implement the API Call:

In the <script> section of the index.html file, you will find a function named fetchMockData.

The task is to create a new fetchRealData function that makes fetch requests to the Finnhub endpoints for:

/stock/profile2 (for company info)

/quote (for key metrics)

/stock/candle (for historical chart data)

Update the handleFormSubmit function to call your new fetchRealData function instead of fetchMockData.

⚙️ How to Run Locally
Clone the repository to your local machine.

Open the index.html file in any modern web browser.

To test the full functionality with mock data, enter "AAPL" into the search bar.
