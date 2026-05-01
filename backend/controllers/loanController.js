exports.calculateLoan = (req, res) => {
    console.log(`[CALC] Processing request for ${req.user.email}`);
    try {
        const { 
            income, existingEmi, requestedAmount, tenure, creditScore,
            latePayments, hasCreditMix, jobTenure, netTakeHomePay,
            downPayment, assetValue, age, residencyType, employmentType 
        } = req.body;

        // 0. Strict Numeric Helper
        const safeNum = (val) => {
            if (typeof val === 'number') return isNaN(val) ? 0 : val;
            if (val === null || val === undefined || val === '') return 0;
            if (typeof val === 'string') {
                const cleaned = parseFloat(val.replace(/[^0-9.-]+/g, ""));
                return isNaN(cleaned) ? 0 : cleaned;
            }
            return 0;
        };

        // 1. Process Inputs - Explicitly cast to Numbers
        const monthlyGrossIncome = safeNum(income);
        const monthlyNetIncome = safeNum(netTakeHomePay) || (monthlyGrossIncome * 0.85);
        const currentDebt = safeNum(existingEmi);
        const loanRequested = safeNum(requestedAmount);
        const months = Math.max(1, parseInt(tenure) || 12);
        const score = parseInt(creditScore) || 300;
        const lates = Math.max(0, parseInt(latePayments) || 0);
        const applicantAge = parseInt(age) || 18;
        const collateralValue = safeNum(assetValue);

        // 2. Interest Rate Engine - Zero NaN tolerance
        let annualRate = 0.15;
        if (score >= 800) annualRate = 0.085;
        else if (score >= 750) annualRate = 0.095;
        else if (score >= 700) annualRate = 0.105;
        else if (score >= 650) annualRate = 0.125;

        annualRate += (lates * 0.005);
        if (hasCreditMix) annualRate -= 0.002;
        annualRate = Math.max(0.05, Math.min(0.24, annualRate)); // 5% min, 24% max

        const r = annualRate / 12;
        const n = months;

        // 3. Debt-to-Income (FOIR) - 50% Limit
        const foir = 0.50;
        const maxTotalEmiAllowed = monthlyNetIncome * foir;
        const maxNewEmiAllowed = Math.max(0, maxTotalEmiAllowed - currentDebt);

        // 4. EMI Factor Calculation with High-Precision Safety
        let emiFactor = 0;
        const pow = Math.pow(1 + r, n);
        if (r > 0 && pow > 1) {
            emiFactor = (r * pow) / (pow - 1);
        } else {
            emiFactor = 1 / n;
        }
        
        // Safety check for emiFactor
        if (emiFactor < 1/360) emiFactor = 1/n; 

        const requiredEmi = loanRequested * emiFactor;
        const ltv = collateralValue > 0 ? (loanRequested / collateralValue) * 100 : 0;

        // 5. Hard Underwriting Verdicts
        let status = "Approved";
        let riskReasons = [];
        let riskLevel = "Low";

        if (lates > 0) {
            riskLevel = "Medium";
            riskReasons.push(`${lates} late payment(s) flagged.`);
            if (lates >= 3) { status = "Rejected"; riskLevel = "High"; riskReasons.push("Chronic repayment issues."); }
        }

        if (Number(jobTenure) < 2) {
            riskLevel = riskLevel === "Low" ? "Medium" : riskLevel;
            riskReasons.push("Professional stability threshold not met.");
        }

        const ageAtMaturity = Number(applicantAge) + (n / 12);
        if (ageAtMaturity > 60) {
            status = "Reduced Offer";
            riskReasons.push(`Tenure exceeds retirement ceiling (${ageAtMaturity.toFixed(1)} > 60).`);
        }

        if (ltv > 90) {
            status = "Rejected"; riskLevel = "High";
            riskReasons.push(`LTV (${ltv.toFixed(0)}%) exceeds 90% collateral limit.`);
        }

        // 6. Max Eligible Logic
        let maxEligibleAmount = 0;
        let emiForMaxAmount = 0;
        if (maxNewEmiAllowed > 0 && emiFactor > 0) {
            maxEligibleAmount = Math.min(100000000, maxNewEmiAllowed / emiFactor);
            emiForMaxAmount = maxNewEmiAllowed;
        }

        // 7. Amortization Schedule
        const schedule = [];
        let bal = loanRequested;
        let totalInt = 0;
        
        for (let i = 1; i <= Math.min(n, 360); i++) {
            const intM = bal * r;
            const prinM = Math.max(0, requiredEmi - intM);
            bal = Math.max(0, bal - prinM);
            totalInt += intM;
            
            if (i === 1 || i % 6 === 0 || i === n) {
                schedule.push({
                    month: i,
                    balance: Math.round(bal),
                    interestPaid: Math.round(intM),
                    principalPaid: Math.round(prinM),
                    totalInterest: Math.round(totalInt)
                });
            }
        }

        if (score < 600) {
            status = "Rejected"; riskLevel = "High"; riskReasons.push("Credit score below requirement.");
        } else if (maxNewEmiAllowed <= 0) {
            status = "Rejected"; riskLevel = "High"; riskReasons.push("Debt-to-income limit reached.");
        } else if (requiredEmi > maxNewEmiAllowed && status === "Approved") {
            status = "Reduced Offer"; riskLevel = "Medium"; riskReasons.push("Requested EMI exceeds monthly ceiling.");
        }

        if (riskReasons.length === 0) riskReasons.push("Strong financial profile verified.");

        const f = (num) => isNaN(num) || num === Infinity ? 0 : Number(num.toFixed(2));

        res.json({
            status,
            requiredEmi: f(requiredEmi),
            maxEmiAllowed: f(maxNewEmiAllowed),
            maxEligibleAmount: f(maxEligibleAmount),
            emiForMaxAmount: f(emiForMaxAmount),
            riskLevel,
            riskReasons,
            interestRate: f(annualRate * 100),
            ltv: f(ltv),
            foirUsed: monthlyNetIncome > 0 ? f((currentDebt / monthlyNetIncome) * 100) : 0,
            totalInterest: f(totalInt),
            totalRepayment: f(loanRequested + totalInt),
            schedule
        });
    } catch (err) {
        console.error('[CALC ERROR]', err);
        res.status(500).json({ message: "Internal calculation error", error: err.message });
    }
};
