import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { scenario1Fire } from '../data/scenario1_fire';
import { scenario2Tax } from '../data/scenario2_tax';
import { scenario3MF } from '../data/scenario3_mf';
import { validateProfileInput } from '../utils/guardrails';
import { Sparkles, User, DollarSign, Home, Target } from 'lucide-react';

const InputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: 30,
    annualIncome: 0,
    monthlyExpenses: 0,
    hraReceived: 0,
    cityType: 'Metro',
    investments80C: 0,
    hasHealthInsurance: false,
    npsContribution: 0,
    homeLoanInterest: 0,
    existingMF: 0,
    existingPPF: 0,
    existingFD: 0,
    existingStocks: 0,
    retirementAge: 60,
    goals: []
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const loadScenario = (scenario) => {
    setFormData(scenario);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateProfileInput(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ET AI Money Mentor</h1>
          <p className="text-lg text-gray-600">Get your personalized financial health report in 5 minutes</p>
        </div>

        {/* Test Scenarios */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Test Scenarios</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => loadScenario(scenario1Fire)}
              className="justify-start text-left h-auto py-3"
              data-testid="load-scenario-1-btn"
            >
              <div>
                <div className="font-semibold text-sm">Scenario 1: FIRE Plan</div>
                <div className="text-xs text-gray-500">Rahul, 34yr Software Engineer</div>
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => loadScenario(scenario2Tax)}
              className="justify-start text-left h-auto py-3"
              data-testid="load-scenario-2-btn"
            >
              <div>
                <div className="font-semibold text-sm">Scenario 2: Tax Edge Case</div>
                <div className="text-xs text-gray-500">₹18L salary - PDF test</div>
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => loadScenario(scenario3MF)}
              className="justify-start text-left h-auto py-3"
              data-testid="load-scenario-3-btn"
            >
              <div>
                <div className="font-semibold text-sm">Scenario 3: MF Portfolio</div>
                <div className="text-xs text-gray-500">Arjun, 42yr, X-Ray Analysis</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          {/* Personal Details */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? 'border-red-500' : ''}
                  data-testid="input-name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                  min="18"
                  max="65"
                  className={errors.age ? 'border-red-500' : ''}
                  data-testid="input-age"
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
              </div>
            </div>
          </div>

          {/* Income & Expenses */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Income & Expenses</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annualIncome">Annual Income / CTC (₹)</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  value={formData.annualIncome}
                  onChange={(e) => handleInputChange('annualIncome', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 1200000"
                  className={errors.annualIncome ? 'border-red-500' : ''}
                  data-testid="input-annual-income"
                />
                {errors.annualIncome && <p className="text-red-500 text-xs mt-1">{errors.annualIncome}</p>}
              </div>
              <div>
                <Label htmlFor="monthlyExpenses">Monthly Expenses (₹)</Label>
                <Input
                  id="monthlyExpenses"
                  type="number"
                  value={formData.monthlyExpenses}
                  onChange={(e) => handleInputChange('monthlyExpenses', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 40000"
                  data-testid="input-monthly-expenses"
                />
              </div>
              <div>
                <Label htmlFor="hraReceived">HRA Received per Year (₹)</Label>
                <Input
                  id="hraReceived"
                  type="number"
                  value={formData.hraReceived}
                  onChange={(e) => handleInputChange('hraReceived', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 240000"
                  data-testid="input-hra"
                />
              </div>
              <div>
                <Label htmlFor="cityType">City Type</Label>
                <Select value={formData.cityType} onValueChange={(value) => handleInputChange('cityType', value)}>
                  <SelectTrigger data-testid="select-city-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Metro">Metro</SelectItem>
                    <SelectItem value="Non-Metro">Non-Metro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tax Deductions */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Tax Deductions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investments80C">80C Investments Done This Year (₹)</Label>
                <Input
                  id="investments80C"
                  type="number"
                  value={formData.investments80C}
                  onChange={(e) => handleInputChange('investments80C', parseFloat(e.target.value) || 0)}
                  placeholder="Max 1,50,000"
                  data-testid="input-80c"
                />
              </div>
              <div>
                <Label htmlFor="npsContribution">NPS Contribution (₹)</Label>
                <Input
                  id="npsContribution"
                  type="number"
                  value={formData.npsContribution}
                  onChange={(e) => handleInputChange('npsContribution', parseFloat(e.target.value) || 0)}
                  placeholder="80CCD(1B) - Max 50,000"
                  data-testid="input-nps"
                />
              </div>
              <div>
                <Label htmlFor="homeLoanInterest">Home Loan Interest Paid This Year (₹)</Label>
                <Input
                  id="homeLoanInterest"
                  type="number"
                  value={formData.homeLoanInterest}
                  onChange={(e) => handleInputChange('homeLoanInterest', parseFloat(e.target.value) || 0)}
                  placeholder="Sec 24b - Max 2,00,000"
                  data-testid="input-home-loan"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="hasHealthInsurance"
                  checked={formData.hasHealthInsurance}
                  onCheckedChange={(checked) => handleInputChange('hasHealthInsurance', checked)}
                  data-testid="switch-health-insurance"
                />
                <Label htmlFor="hasHealthInsurance" className="cursor-pointer">
                  I pay health insurance premium
                </Label>
              </div>
            </div>
          </div>

          {/* Existing Investments */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Existing Investments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="existingMF">Mutual Funds (₹)</Label>
                <Input
                  id="existingMF"
                  type="number"
                  value={formData.existingMF}
                  onChange={(e) => handleInputChange('existingMF', parseFloat(e.target.value) || 0)}
                  data-testid="input-mf"
                />
              </div>
              <div>
                <Label htmlFor="existingPPF">PPF (₹)</Label>
                <Input
                  id="existingPPF"
                  type="number"
                  value={formData.existingPPF}
                  onChange={(e) => handleInputChange('existingPPF', parseFloat(e.target.value) || 0)}
                  data-testid="input-ppf"
                />
              </div>
              <div>
                <Label htmlFor="existingFD">Fixed Deposits (₹)</Label>
                <Input
                  id="existingFD"
                  type="number"
                  value={formData.existingFD}
                  onChange={(e) => handleInputChange('existingFD', parseFloat(e.target.value) || 0)}
                  data-testid="input-fd"
                />
              </div>
              <div>
                <Label htmlFor="existingStocks">Stocks (₹)</Label>
                <Input
                  id="existingStocks"
                  type="number"
                  value={formData.existingStocks}
                  onChange={(e) => handleInputChange('existingStocks', parseFloat(e.target.value) || 0)}
                  data-testid="input-stocks"
                />
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Retirement & Goals</h2>
            <div className="mb-6">
              <Label htmlFor="retirementAge">Retirement Goal Age: {formData.retirementAge}</Label>
              <Slider
                id="retirementAge"
                min={45}
                max={65}
                step={1}
                value={[formData.retirementAge]}
                onValueChange={(value) => handleInputChange('retirementAge', value[0])}
                className="mt-2"
                data-testid="slider-retirement-age"
              />
            </div>
            <div>
              <Label className="mb-3 block">Life Goals (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3">
                {['Retirement', 'Child Education', 'Home Purchase', 'Emergency Fund'].map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={formData.goals.includes(goal)}
                      onCheckedChange={() => handleGoalToggle(goal)}
                      data-testid={`checkbox-goal-${goal.toLowerCase().replace(' ', '-')}`}
                    />
                    <Label htmlFor={goal} className="cursor-pointer text-sm">
                      {goal}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-6 text-lg font-semibold"
            data-testid="submit-form-btn"
          >
            Get My Financial Health Report
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;