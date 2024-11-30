document.addEventListener('DOMContentLoaded', function() {
    // Pie Chart - Cost Breakdown
    const costBreakdownCtx = document.getElementById('costBreakdownChart').getContext('2d');
    new Chart(costBreakdownCtx, {
        type: 'pie',
        data: {
            labels: ['Hardware (82.6%)', 'Installation (7.6%)', 'Software & Integration (9.8%)'],
            datasets: [{
                data: [1569800, 145000, 185000],
                backgroundColor: [
                    '#4e73df',
                    '#1cc88a',
                    '#36b9cc'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'CAPEX Breakdown (Total: RM1,899,800)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw.toLocaleString('en-MY', {
                                style: 'currency',
                                currency: 'MYR'
                            });
                            return `${context.label}: ${value}`;
                        }
                    }
                }
            }
        }
    });

    // Bar Chart - Annual OPEX Breakdown
    const capexOpexCtx = document.getElementById('capexOpexChart').getContext('2d');
    new Chart(capexOpexCtx, {
        type: 'bar',
        data: {
            labels: ['Maintenance', 'Support Services', 'Connectivity'],
            datasets: [
                {
                    label: 'Annual Cost (RM)',
                    data: [158000, 126000, 91200],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc'
                    ]
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cost (RM)'
                    },
                    ticks: {
                        callback: function(value) {
                            return 'RM ' + value.toLocaleString();
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Annual OPEX Breakdown (Total: RM375,200)'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'RM ' + context.raw.toLocaleString();
                        }
                    }
                }
            }
        }
    });
});
