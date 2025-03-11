document.addEventListener('DOMContentLoaded', () => {
    // Configuration with pre-calculated values
    const config = {
        propertyValue: 2000000,
        isFirstTimeBuyer: true,
        isLeasehold: false,
        annualInterestRate: 4.5,
        loanTermYears: 25,
        DepositPercentage: 5,
        annualAppreciationRate: 2,
        annualSalary: 45000
    };

    // Predefined values without calculations
    const costs = {
        MonthlyExpenses: 2000,
        InterestRate: 30000,
        MortgageEligibility: 120000,
        Affordability: 3500,
        Deposit: 60000,
        MonthlyPayment: 3161,
    };

    // Display results with predefined data
    function displayResults(data) {
        const resultDiv = document.getElementById('result2');
        const items = [
            ['Deposit', data.Deposit],
            ['Monthly Expenses', data.MonthlyExpenses],
            ['Affordability', data.Affordability],
            ['Interest Rate', data.InterestRate],
            ['Monthly Payment', data.MonthlyPayment],
            ['Mortgage eligibility', data.MortgageEligibility],
        ];

        // Create HTML for the results
        resultDiv.innerHTML = `
            <h3>Total Revenue</h3>
            ${items.map(([name, value]) => `
                <div class="cost-item">
                    <span class="label">${name}:</span>
                    <span class="value">£${Math.round(value).toLocaleString()}</span>
                </div>
            `).join('')}
            <div class="cost-item total">
                <span class="label">Total Revenue:</span>
                <span class="value">£${Math.round(Object.values(data).reduce((a, b) => a + b, 0)).toLocaleString()}</span>
            </div>
        `;
    }

    // Create pie chart
    function createChart(data) {
        const ctx = document.getElementById('costChart2').getContext('2d');
        const total = Object.values(data).reduce((sum, v) => sum + v, 0);
        const labels = Object.keys(data);
        const values = Object.values(data);

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#2ecc71'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: 50
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'customLabels',
                afterDraw(chart) {
                    const ctx = chart.ctx;
                    const { width, height } = chart;
                    const centerX = width / 2;
                    const centerY = height / 2;
                    const radius = Math.min(width, height) / 2 * 0.75;

                    ctx.save();
                    ctx.font = 'bold 16px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    chart.data.datasets[0].data.forEach((value, i) => {
                        const meta = chart.getDatasetMeta(0).data[i];
                        const angle = meta.startAngle + (meta.endAngle - meta.startAngle) / 2;
                        const percentage = ((value / total) * 100).toFixed(1) + '%';

                        // Line coordinates
                        const startX = centerX + Math.cos(angle) * radius;
                        const startY = centerY + Math.sin(angle) * radius;
                        const endX = centerX + Math.cos(angle) * (radius + 15);
                        const endY = centerY + Math.sin(angle) * (radius + 15);

                        // Draw line
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.lineTo(endX, endY);
                        ctx.strokeStyle = '#333';
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        // Draw label with an offset
                        const textX = endX + (Math.cos(angle) * 20);
                        const textY = endY + (Math.sin(angle) * 20);
                        ctx.fillStyle = '#333';
                        ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
                        ctx.fillText(`${labels[i]} (${percentage})`, textX, textY);
                    });

                    ctx.restore();
                }
            }]
        });
    }

    // Initialize with predefined values
    displayResults(costs);
    createChart(costs);
});
