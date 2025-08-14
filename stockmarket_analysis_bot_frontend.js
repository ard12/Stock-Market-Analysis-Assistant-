<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Analysis Bot</title>
    <!-- Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Chart.js for creating charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Use Inter as the default font */
        body {
            font-family: 'Inter', sans-serif;
        }
        /* Simple loader style */
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="bg-gray-100 text-gray-800">

    <div class="container mx-auto p-4 md:p-8 max-w-4xl">
        <!-- Header Section -->
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900">Stock Analysis Bot</h1>
            <p class="text-md text-gray-600 mt-2">Enter a stock ticker symbol (e.g., AAPL, GOOGL) to get the latest data.</p>
        </header>

        <!-- Search Bar Section -->
        <div class="mb-8">
            <form id="stock-form" class="flex flex-col sm:flex-row gap-2">
                <input type="text" id="ticker-input" placeholder="Enter Stock Ticker..." class="flex-grow p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors">
                <button type="submit" class="bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition-colors shadow">
                    Get Stock Data
                </button>
            </form>
        </div>

        <!-- Loading and Error Message Section -->
        <div id="loader" class="hidden justify-center items-center my-8">
            <div class="loader"></div>
        </div>
        <div id="error-message" class="hidden text-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
            <!-- Error messages will be displayed here -->
        </div>


        <!-- Results Section -->
        <main id="results-section" class="hidden">
            <!-- Company Info Section -->
            <div id="company-info" class="bg-white p-6 rounded-xl shadow-md mb-8">
                <div class="flex items-center mb-4">
                    <img id="company-logo" src="" alt="Company Logo" class="w-16 h-16 mr-4 rounded-full" onerror="this.onerror=null;this.src='https://placehold.co/64x64/e2e8f0/e2e8f0?text=...';">
                    <div>
                        <h2 id="company-name" class="text-2xl font-bold"></h2>
                        <p id="company-ticker" class="text-lg text-gray-500"></p>
                    </div>
                </div>
                <p id="company-exchange" class="text-sm text-gray-600"></p>
                <p id="company-industry" class="text-sm text-gray-600"></p>
            </div>

            <!-- Key Metrics Section -->
            <div id="key-metrics" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                <div class="bg-white p-4 rounded-xl shadow-md">
                    <h3 class="text-sm font-medium text-gray-500">Current Price</h3>
                    <p id="current-price" class="text-2xl font-bold"></p>
                </div>
                <div class="bg-white p-4 rounded-xl shadow-md">
                    <h3 class="text-sm font-medium text-gray-500">Day High</h3>
                    <p id="day-high" class="text-2xl font-bold text-green-600"></p>
                </div>
                <div class="bg-white p-4 rounded-xl shadow-md">
                    <h3 class="text-sm font-medium text-gray-500">Day Low</h3>
                    <p id="day-low" class="text-2xl font-bold text-red-600"></p>
                </div>
                <div class="bg-white p-4 rounded-xl shadow-md">
                    <h3 class="text-sm font-medium text-gray-500">Previous Close</h3>
                    <p id="prev-close" class="text-2xl font-bold"></p>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="bg-white p-6 rounded-xl shadow-md">
                <h3 class="text-xl font-bold mb-4">Historical Price (Last 30 Days)</h3>
                <canvas id="stock-chart"></canvas>
            </div>
        </main>
    </div>

    <!-- JavaScript to handle API calls and DOM manipulation -->
    <script>
        // --- DOM ELEMENT REFERENCES ---
        const stockForm = document.getElementById('stock-form');
        const tickerInput = document.getElementById('ticker-input');
        const loader = document.getElementById('loader');
        const errorMessage = document.getElementById('error-message');
        const resultsSection = document.getElementById('results-section');
        
        // Company Info
        const companyLogo = document.getElementById('company-logo');
        const companyName = document.getElementById('company-name');
        const companyTicker = document.getElementById('company-ticker');
        const companyExchange = document.getElementById('company-exchange');
        const companyIndustry = document.getElementById('company-industry');

        // Key Metrics
        const currentPrice = document.getElementById('current-price');
        const dayHigh = document.getElementById('day-high');
        const dayLow = document.getElementById('day-low');
        const prevClose = document.getElementById('prev-close');

        // Chart
        const stockChartCanvas = document.getElementById('stock-chart');
        let stockChart; // To hold the chart instance

        // --- MOCK DATA (To be replaced with API calls) ---
        // This function simulates fetching data from an API.
        const fetchMockData = (ticker) => {
            return new Promise((resolve, reject) => {
                // Simulate network delay
                setTimeout(() => {
                    // For this demo, we only return data if the ticker is 'AAPL' (case-insensitive)
                    if (ticker.toUpperCase() === 'AAPL') {
                        const mockData = {
                            profile: {
                                name: 'Apple Inc.',
                                ticker: 'AAPL',
                                logo: 'https://static.finnhub.io/logo/87cb30d8-80df-11e8-8919-000000000000.png',
                                exchange: 'NASDAQ Global Select',
                                finnhubIndustry: 'Technology',
                            },
                            quote: {
                                c: 214.29, // Current price
                                h: 215.55, // Day high
                                l: 211.30, // Day low
                                pc: 212.49, // Previous close
                            },
                            historical: {
                                // 30 days of fake closing prices and timestamps
                                c: [212.49, 207.48, 208.14, 214.01, 212.45, 209.95, 209.07, 205.3, 191.29, 191.45, 190.29, 189.87, 189.46, 189.98, 190.92, 182.58, 186.28, 183.38, 183.43, 180.57, 179.3, 175.05, 172.28, 169.3, 169.04, 171.18, 174.24, 175.04, 176.55, 173.97],
                                t: [1720569600, 1720483200, 1720137600, 1720051200, 1719964800, 1719878400, 1719792000, 1719532800, 1719446400, 1719360000, 1719273600, 1719187200, 1718928000, 1718841600, 1718755200, 1718668800, 1718582400, 1718323200, 1718236800, 1718150400, 1718064000, 1717977600, 1717718400, 1717632000, 1717545600, 1717459200, 1717372800, 1717113600, 1717027200, 1716940800].map(ts => ts * 1000) // Convert UNIX timestamps to JS milliseconds
                            }
                        };
                        resolve(mockData);
                    } else {
                        // Reject for any other ticker
                        reject(`Could not find data for "${ticker}". Please try 'AAPL' for this demo.`);
                    }
                }, 1000); // 1-second delay
            });
        };

        // --- UI UPDATE FUNCTIONS ---

        const displayCompanyInfo = (profile) => {
            companyName.textContent = profile.name || 'N/A';
            companyTicker.textContent = profile.ticker || 'N/A';
            companyLogo.src = profile.logo || 'https://placehold.co/64x64/e2e8f0/e2e8f0?text=...';
            companyExchange.textContent = `Exchange: ${profile.exchange || 'N/A'}`;
            companyIndustry.textContent = `Industry: ${profile.finnhubIndustry || 'N/A'}`;
        };

        const displayKeyMetrics = (quote) => {
            currentPrice.textContent = `$${quote.c?.toFixed(2) || '0.00'}`;
            dayHigh.textContent = `$${quote.h?.toFixed(2) || '0.00'}`;
            dayLow.textContent = `$${quote.l?.toFixed(2) || '0.00'}`;
            prevClose.textContent = `$${quote.pc?.toFixed(2) || '0.00'}`;
        };

        const displayStockChart = (historical) => {
            // If a chart instance already exists, destroy it before creating a new one
            if (stockChart) {
                stockChart.destroy();
            }

            const labels = historical.t.map(timestamp => new Date(timestamp).toLocaleDateString());
            const data = historical.c;

            const ctx = stockChartCanvas.getContext('2d');
            stockChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.reverse(), // Reverse to show oldest to newest
                    datasets: [{
                        label: 'Closing Price',
                        data: data.reverse(), // Match labels
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        };
        
        const displayError = (msg) => {
            errorMessage.textContent = msg;
            errorMessage.classList.remove('hidden');
        };

        // --- EVENT HANDLER ---

        const handleFormSubmit = async (event) => {
            event.preventDefault();
            const ticker = tickerInput.value.trim();

            if (!ticker) {
                displayError('Please enter a stock ticker.');
                return;
            }

            // Reset UI
            loader.style.display = 'flex'; // Use style.display for flex
            resultsSection.classList.add('hidden');
            errorMessage.classList.add('hidden');

            try {
                // *** THIS IS WHERE YOU'LL SWAP TO A REAL API CALL ***
                // For now, we use our mock data function.
                const data = await fetchMockData(ticker);
                
                // Populate the UI with the fetched data
                displayCompanyInfo(data.profile);
                displayKeyMetrics(data.quote);
                displayStockChart(data.historical);
                
                // Show the results
                resultsSection.classList.remove('hidden');

            } catch (error) {
                displayError(error);
            } finally {
                // Always hide the loader
                loader.style.display = 'none';
            }
        };

        // Attach event listener to the form
        stockForm.addEventListener('submit', handleFormSubmit);

    </script>

</body>
</html>
