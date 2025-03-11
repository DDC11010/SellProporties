document.addEventListener('DOMContentLoaded', () => {
    // Configuration
    const config = {
        propertyValue: 2000000,
        isFirstTimeBuyer: true,
        isLeasehold: false,
        annualInterestRate: 4.5,
        loanTermYears: 25,
        depositPercentage: 5,
        annualAppreciationRate: 2,
        annualSalary: 45000
    };

    // Main calculation function
    function calculateCosts() {
        const costs = {
            estateAgent: config.propertyValue * 0.015,
            mortgageBroker: 1000,
            epc: 10000,
            survey: 10000,
            legal: 10000,
            mortgageFees: 10000,
            deposit: config.propertyValue * (config.depositPercentage / 100)
        };

        const principal = config.propertyValue - costs.deposit;
        const monthlyRate = (config.annualInterestRate / 100) / 12;
        const months = config.loanTermYears * 12;

        costs.monthlyPayment = principal * 
            (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
            (Math.pow(1 + monthlyRate, months) - 1);

        return {
            costs,
            principal,
            monthlyPayment: costs.monthlyPayment,
            totalUpfront: Object.values(costs).reduce((a, b) => a + b, 0)
        };
    }

    // Display results
    function displayResults(data) {
        const resultDiv = document.getElementById('result');
        const items = [
            ['Deposit', data.costs.deposit],
            ['Estate Agent Fees', data.costs.estateAgent],
            ['Mortgage Broker Fees', data.costs.mortgageBroker],
            ['EPC Certificate', data.costs.epc],
            ['Survey Costs', data.costs.survey],
            ['Legal Fees', data.costs.legal],
            ['Mortgage Fees', data.costs.mortgageFees]
        ];

        // Create HTML for the results
        resultDiv.innerHTML = `
            <h3>Upfront Costs Breakdown</h3>
            ${items.map(([name, value]) => `
                <div class="cost-item">
                    <span class="label">${name}:</span>
                    <span class="value">£${Math.round(value).toLocaleString()}</span>
                </div>
            `).join('')}
            <div class="cost-item total">
                <span class="label">Total Upfront Costs:</span>
                <span class="value">£${Math.round(data.totalUpfront).toLocaleString()}</span>
            </div>
        `;
    }

    // Create pie chart
    function createChart(data) {
        const ctx = document.getElementById('costChart').getContext('2d');
        const total = Object.values(data.costs).reduce((sum, v) => sum + v, 0);
        const labels = Object.keys(data.costs);
        const values = Object.values(data.costs);

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
                    const radius = Math.min(width, height) / 2 * 0.75; // Increased the radius to push lines outside

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
                        const endX = centerX + Math.cos(angle) * (radius + 15);  // Adjusted the length of the lines
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

    // Initialize
    const results = calculateCosts();
    displayResults(results);
    createChart(results);
});