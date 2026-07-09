/**
 * Morgan Vance | BBA Portfolio Interactivity & Live Strategy Ledger
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Theme Switcher & Mobile Menu
    // ----------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // Set system/default theme
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const targetTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    });

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        // Simple visual transition for burger
        const spans = menuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // ----------------------------------------------------
    // Scroll Progress Indicator
    // ----------------------------------------------------
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
    });

    // ----------------------------------------------------
    // Tabbed Case Studies Interface
    // ----------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const casePanels = document.querySelectorAll('.case-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabButtons.forEach(b => b.classList.remove('active'));
            casePanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // Professional Toolkit Category Filter
    // ----------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetFilter = btn.getAttribute('data-filter');

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (targetFilter === 'all' || category === targetFilter) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------
    // One-of-a-Kind: Interactive Business Scenario Planner
    // ----------------------------------------------------
    const initialCapInput = document.getElementById('initialCap');
    const priceInput = document.getElementById('price');
    const cogsInput = document.getElementById('cogs');
    const overheadInput = document.getElementById('overhead');
    const salesVolumeInput = document.getElementById('salesVolume');

    // Display labels
    const valInitialCap = document.getElementById('valInitialCap');
    const valPrice = document.getElementById('valPrice');
    const valCogs = document.getElementById('valCogs');
    const valOverhead = document.getElementById('valOverhead');
    const valSalesVolume = document.getElementById('valSalesVolume');

    // Output indicators
    const resGrossMargin = document.getElementById('resGrossMargin');
    const resBreakEven = document.getElementById('resBreakEven');
    const resMonthlyProfit = document.getElementById('resMonthlyProfit');
    const resPayback = document.getElementById('resPayback');
    const chartContainer = document.getElementById('chartContainer');
    const growthWarning = document.getElementById('growthWarning');

    function formatCurrency(val) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    }

    function calculateScenarios() {
        const capEx = parseFloat(initialCapInput.value);
        const price = parseFloat(priceInput.value);
        const cogs = parseFloat(cogsInput.value);
        const fixedCost = parseFloat(overheadInput.value);
        const units = parseFloat(salesVolumeInput.value);

        // Update control value labels in real-time
        valInitialCap.textContent = formatCurrency(capEx);
        valPrice.textContent = formatCurrency(price);
        valCogs.textContent = formatCurrency(cogs);
        valOverhead.textContent = formatCurrency(fixedCost);
        valSalesVolume.textContent = `${units} units`;

        // Mathematical Operations for Business Scenario
        const contributionMargin = price - cogs;
        const grossMarginPercent = price > 0 ? (contributionMargin / price) * 100 : 0;

        // Break-even Units = Fixed Costs / Contribution Margin
        const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCost / contributionMargin) : Infinity;

        // Monthly Profit = (Units * Contribution Margin) - Fixed Costs
        const monthlyNetProfit = (units * contributionMargin) - fixedCost;

        // Payback Period = CapEx / Monthly Net Profit
        const paybackMonths = monthlyNetProfit > 0 ? (capEx / monthlyNetProfit) : Infinity;

        // Update UI Outputs
        resGrossMargin.textContent = `${Math.max(0, grossMarginPercent).toFixed(1)}%`;

        if (breakEvenUnits === Infinity || breakEvenUnits <= 0) {
            resBreakEven.textContent = 'Unachievable';
        } else {
            resBreakEven.textContent = `${breakEvenUnits} units`;
        }

        resMonthlyProfit.textContent = formatCurrency(monthlyNetProfit);
        if (monthlyNetProfit <= 0) {
            resMonthlyProfit.className = 'kpi-value text-danger';
        } else {
            resMonthlyProfit.className = 'kpi-value text-success';
        }

        if (paybackMonths === Infinity) {
            resPayback.textContent = 'Never';
            resPayback.style.color = 'var(--color-danger)';
        } else {
            resPayback.textContent = `${paybackMonths.toFixed(1)} Mo.`;
            resPayback.style.color = paybackMonths <= 6 ? 'var(--color-success)' : 'var(--color-accent)';
        }

        // Render cumulative profit forecast chart (12 Months)
        renderChart(capEx, monthlyNetProfit);
    }

    function renderChart(capEx, monthlyNetProfit) {
        chartContainer.innerHTML = ''; // Reset chart layout
        let cumulativeBalance = -capEx;
        let maxAbsValue = capEx; // scale relative to max balance point to fit grid

        // Compute balances for 12 months to determine chart scaling factor
        const balances = [];
        for (let m = 1; m <= 12; m++) {
            cumulativeBalance += monthlyNetProfit;
            balances.push(cumulativeBalance);
            if (Math.abs(cumulativeBalance) > maxAbsValue) {
                maxAbsValue = Math.abs(cumulativeBalance);
            }
        }

        // Generate stacked bar layout
        balances.forEach((balance, idx) => {
            const barGroup = document.createElement('div');
            barGroup.className = 'chart-bar-group';

            // Calculate percentage height
            const heightPercent = maxAbsValue > 0 ? (Math.abs(balance) / maxAbsValue) * 100 : 0;

            const bar = document.createElement('div');
            bar.className = 'chart-bar-stacked';
            bar.style.height = `${Math.max(3, heightPercent)}%`; // Minimum height for visibility

            if (balance < 0) {
                bar.classList.add('negative');
            }

            // Create contextual tooltip
            const tooltip = document.createElement('span');
            tooltip.className = 'bar-tooltip';
            tooltip.textContent = `Mo. ${idx + 1}: ${balance >= 0 ? '+' : ''}${formatCurrency(balance)}`;

            // Label element
            const label = document.createElement('span');
            label.className = 'chart-label-month';
            label.textContent = `M${idx + 1}`;

            barGroup.appendChild(tooltip);
            barGroup.appendChild(bar);
            barGroup.appendChild(label);
            chartContainer.appendChild(barGroup);
        });

        // Toggle alerts for negative strategy forecasts
        if (monthlyNetProfit <= 0) {
            growthWarning.textContent = 'Strategic Warning: Monthly profit is negative. This business model will deplete cash reserves without restructuring pricing/overheads.';
            growthWarning.style.display = 'block';
        } else if (cumulativeBalance < 0) {
            growthWarning.textContent = 'Optimized Pivot Notice: Monthly operations are profitable, but high CapEx demands more than 12 months to break even completely.';
            growthWarning.style.display = 'block';
            growthWarning.style.borderColor = 'var(--color-accent)';
            growthWarning.style.color = 'var(--color-accent)';
            growthWarning.style.backgroundColor = 'rgba(192, 140, 54, 0.04)';
        } else {
            growthWarning.style.display = 'none';
        }
    }

    // Attach listeners to input triggers
    [initialCapInput, priceInput, cogsInput, overheadInput, salesVolumeInput].forEach(inp => {
        inp.addEventListener('input', calculateScenarios);
    });

    // Run first calculation on load
    calculateScenarios();

    // ----------------------------------------------------
    // Mock Contact Form Submission
    // ----------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const subject = document.getElementById('messageSubject').value;
        const message = document.getElementById('userMessage').value;

        // Perform mock dispatch API request
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${name}. Your strategic inquiry focusing on "${subject}" has been queued. Morgan will connect with you shortly at ${email}.`;

        // Reset form controls
        contactForm.reset();
    });
});
