// SEBI compliance and validation guardrails

export const SEBI_DISCLAIMER = "⚠️ This is AI-generated guidance for educational purposes only and does not constitute licensed financial advice under SEBI or RBI regulations. Please consult a SEBI-registered financial advisor before making investment or tax decisions.";

export const validateProfileInput = (formData) => {
  const errors = {};
  
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (!formData.age || formData.age < 18 || formData.age > 65) {
    errors.age = 'Age must be between 18 and 65';
  }
  
  if (!formData.annualIncome || formData.annualIncome <= 0) {
    errors.annualIncome = 'Annual income must be greater than 0';
  }
  
  if (!formData.monthlyExpenses || formData.monthlyExpenses < 0) {
    errors.monthlyExpenses = 'Monthly expenses cannot be negative';
  }
  
  if (formData.retirementAge && (formData.retirementAge < formData.age || formData.retirementAge > 65)) {
    errors.retirementAge = 'Retirement age must be between current age and 65';
  }
  
  return errors;
};