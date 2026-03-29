from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Get LLM API key
LLM_API_KEY = os.environ.get('EMERGENT_LLM_KEY')

if not LLM_API_KEY:
    logging.warning("EMERGENT_LLM_KEY not found in environment variables")

# Models
class ProfileInput(BaseModel):
    name: str
    age: int
    annualIncome: float
    monthlyExpenses: float
    hraReceived: float
    cityType: str
    investments80C: float
    hasHealthInsurance: bool
    npsContribution: float
    homeLoanInterest: float
    existingMF: float
    existingPPF: float
    existingFD: float
    existingStocks: float
    retirementAge: int
    goals: List[str]
    mfPortfolio: Optional[List[Dict[str, Any]]] = None

class AgentResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    sessionId: str
    profileData: Dict[str, Any]
    healthScore: Dict[str, Any]
    taxComparison: Dict[str, Any]
    advisory: Dict[str, Any]
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Agent 1: Profiler Agent
async def profiler_agent(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validates and enriches user financial profile"""
    try:
        chat = LlmChat(
            api_key=LLM_API_KEY,
            session_id=f"profiler_{uuid.uuid4()}",
            system_message="You are a financial data validator for an Indian tax planning tool."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        prompt = f"""Given this user input: {json.dumps(profile_data)}

Validate all fields, calculate derived values (monthly income, savings rate, existing investment total), identify the user's life stage (early career/mid career/pre-retirement), and return ONLY a valid JSON object with this exact structure:

{{
  "profile": {{
    "name": "string",
    "age": number,
    "annualIncome": number,
    "monthlyIncome": number,
    "monthlyExpenses": number,
    "monthlySavingsCapacity": number,
    "savingsRate": number,
    "hraReceived": number,
    "cityType": "string",
    "investments80C": number,
    "hasHealthInsurance": boolean,
    "npsContribution": number,
    "homeLoanInterest": number,
    "existingMF": number,
    "existingPPF": number,
    "existingFD": number,
    "existingStocks": number,
    "investmentTotal": number,
    "retirementAge": number,
    "yearsToRetirement": number,
    "goals": ["string"]
  }},
  "lifeStage": "early|mid|pre-retirement",
  "isValid": true,
  "validationNotes": ["string"]
}}

Return only JSON, no explanation."""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        logging.info(f"Profiler raw response length: {len(response)}")
        logging.info(f"Profiler raw response preview: {response[:300]}...")
        
        # Parse JSON from response - handle markdown code blocks
        response_text = response.strip()
        if response_text.startswith('```'):
            # Remove markdown code blocks
            lines = response_text.split('\n')
            response_text = '\n'.join([line for line in lines if not line.strip().startswith('```')])
            response_text = response_text.strip()
        
        result = json.loads(response_text)
        logging.info("Profiler agent SUCCESS")
        return result
    except Exception as e:
        logging.error(f"Profiler agent error: {str(e)}")
        if 'response' in locals():
            logging.error(f"Response dump: {response[:1000]}")
        raise HTTPException(status_code=500, detail=f"Profiler agent failed: {str(e)}")

# Agent 2: Scorer Agent
async def scorer_agent(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates Money Health Score across 6 dimensions"""
    try:
        chat = LlmChat(
            api_key=LLM_API_KEY,
            session_id=f"scorer_{uuid.uuid4()}",
            system_message="You are a financial health scoring engine for Indian users."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        prompt = f"""You are a financial health scoring engine. Given this Indian user profile:
{json.dumps(profile)}

Score each dimension from 0-10 based on these Indian financial benchmarks:
- Emergency fund: 6 months expenses minimum (RBI recommendation)
- Insurance: term cover = 10-15x annual income (IRDAI guideline)
- Diversification: equity 60%, debt 30%, gold 10% for mid-career
- Debt: EMI should not exceed 40% of monthly income
- Tax: using at least 80% of available deductions
- Retirement: on track for 25x annual expenses by retirement age

Return ONLY JSON:
{{
  "totalScore": number out of 100,
  "dimensions": {{
    "emergencyFund": {{ "score": 0-10, "insight": "one sentence", "status": "good|warn|critical" }},
    "insurance": {{ "score": 0-10, "insight": "one sentence", "status": "good|warn|critical" }},
    "diversification": {{ "score": 0-10, "insight": "one sentence", "status": "good|warn|critical" }},
    "debtHealth": {{ "score": 0-10, "insight": "one sentence", "status": "good|warn|critical" }},
    "taxEfficiency": {{ "score": 0-10, "insight": "one sentence", "status": "good|warn|critical" }},
    "retirement": {{ "score": 0-10, "insight": "one sentence", "status": "good|warn|critical" }}
  }},
  "weakestDimension": "dimension name",
  "topPriority": "one actionable sentence"
}}

Return only JSON."""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Parse JSON from response - handle markdown code blocks
        response_text = response.strip()
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join([line for line in lines if not line.strip().startswith('```')])
            response_text = response_text.strip()
        
        result = json.loads(response_text)
        return result
    except Exception as e:
        logging.error(f"Scorer agent error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scorer agent failed: {str(e)}")

# Agent 3: Tax Calculator Agent
async def calc_agent(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Calculates tax for both old and new regime"""
    try:
        tax_rules = {
            "newRegime": {
                "slabs": [
                    {"min": 0, "max": 300000, "rate": 0},
                    {"min": 300001, "max": 700000, "rate": 5},
                    {"min": 700001, "max": 1000000, "rate": 10},
                    {"min": 1000001, "max": 1200000, "rate": 15},
                    {"min": 1200001, "max": 1500000, "rate": 20},
                    {"min": 1500001, "max": 99999999, "rate": 30}
                ],
                "standardDeduction": 75000,
                "rebateLimit": 1200000
            },
            "oldRegime": {
                "slabs": [
                    {"min": 0, "max": 250000, "rate": 0},
                    {"min": 250001, "max": 500000, "rate": 5},
                    {"min": 500001, "max": 1000000, "rate": 20},
                    {"min": 1000001, "max": 99999999, "rate": 30}
                ],
                "standardDeduction": 50000,
                "rebateLimit": 500000,
                "deductions": {
                    "80C": 150000,
                    "80D": 25000,
                    "80CCD1B": 50000,
                    "homeLoanInterest": 200000
                }
            },
            "cess": 4
        }
        
        chat = LlmChat(
            api_key=LLM_API_KEY,
            session_id=f"calc_{uuid.uuid4()}",
            system_message="You are a precise Indian tax calculator for FY2025-26."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        prompt = f"""You are a precise Indian tax calculator for FY2025-26. Calculate tax for this user:
{json.dumps(profile)}

Using these exact rules: {json.dumps(tax_rules)}

Return ONLY this JSON with every line of working shown:
{{
  "oldRegime": {{
    "steps": [
      {{ "label": "Gross salary", "amount": number }},
      {{ "label": "Less: HRA exemption", "amount": number }},
      {{ "label": "Less: Standard deduction", "amount": 50000 }},
      {{ "label": "Less: 80C deductions", "amount": number }},
      {{ "label": "Less: 80CCD(1B) NPS", "amount": number }},
      {{ "label": "Less: Home loan interest (Sec 24b)", "amount": number }},
      {{ "label": "Taxable income", "amount": number }},
      {{ "label": "Tax on slab 0-2.5L @ 0%", "amount": 0 }},
      {{ "label": "Tax on slab 2.5L-5L @ 5%", "amount": number }},
      {{ "label": "Tax on slab 5L-10L @ 20%", "amount": number }},
      {{ "label": "Tax on above 10L @ 30%", "amount": number }},
      {{ "label": "Total tax before cess", "amount": number }},
      {{ "label": "Health & Education Cess @ 4%", "amount": number }},
      {{ "label": "Total tax payable", "amount": number }}
    ],
    "totalTax": number,
    "effectiveRate": percentage
  }},
  "newRegime": {{
    "steps": [
      {{ "label": "Gross salary", "amount": number }},
      {{ "label": "Less: Standard deduction", "amount": 75000 }},
      {{ "label": "Taxable income", "amount": number }},
      {{ "label": "Tax on slab 0-3L @ 0%", "amount": 0 }},
      {{ "label": "Tax on slab 3L-7L @ 5%", "amount": number }},
      {{ "label": "Tax on slab 7L-10L @ 10%", "amount": number }},
      {{ "label": "Tax on slab 10L-12L @ 15%", "amount": number }},
      {{ "label": "Tax on slab 12L-15L @ 20%", "amount": number }},
      {{ "label": "Tax on above 15L @ 30%", "amount": number }},
      {{ "label": "Total tax before cess", "amount": number }},
      {{ "label": "Health & Education Cess @ 4%", "amount": number }},
      {{ "label": "Total tax payable", "amount": number }}
    ],
    "totalTax": number,
    "effectiveRate": percentage
  }},
  "winner": "old|new",
  "savings": number (absolute difference),
  "recommendation": "one sentence explaining which to choose and why"
}}

Every amount must be exact integer. No rounding errors."""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Parse JSON from response - handle markdown code blocks
        response_text = response.strip()
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join([line for line in lines if not line.strip().startswith('```')])
            response_text = response_text.strip()
        
        result = json.loads(response_text)
        return result
    except Exception as e:
        logging.error(f"Calc agent error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Calc agent failed: {str(e)}")

# Agent 4: Advisory Agent
async def advisory_agent(profile: Dict[str, Any], tax_result: Dict[str, Any]) -> Dict[str, Any]:
    """Provides personalized tax-saving recommendations"""
    try:
        chat = LlmChat(
            api_key=LLM_API_KEY,
            session_id=f"advisory_{uuid.uuid4()}",
            system_message="You are a financial advisor identifying tax-saving opportunities for Indian professionals."
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")
        
        prompt = f"""You are a financial advisor identifying tax-saving opportunities for an Indian salaried professional.

User profile: {json.dumps(profile)}
Tax calculation: {json.dumps(tax_result)}
Optimal regime: {tax_result.get('winner')}

Identify ALL deductions the user has NOT fully claimed. Then recommend exactly 3 tax-saving investment instruments ranked by their risk profile.

Return ONLY JSON:
{{
  "missedDeductions": [
    {{
      "section": "80D",
      "description": "Health insurance premium",
      "maxAllowed": 25000,
      "currentlyClaimed": 0,
      "potentialSaving": number,
      "action": "what to do right now"
    }}
  ],
  "totalMissedSaving": number,
  "instruments": [
    {{
      "name": "instrument name",
      "section": "80C etc",
      "riskLevel": "Low|Medium|High",
      "lockIn": "duration",
      "expectedReturn": "percentage range",
      "taxBenefit": "exact benefit amount for this user",
      "suitability": "why this fits their profile",
      "rank": 1
    }}
  ],
  "summary": "two sentence overall recommendation"
}}

Return only JSON."""
        
        message = UserMessage(text=prompt)
        response = await chat.send_message(message)
        
        # Parse JSON from response - handle markdown code blocks
        response_text = response.strip()
        if response_text.startswith('```'):
            lines = response_text.split('\n')
            response_text = '\n'.join([line for line in lines if not line.strip().startswith('```')])
            response_text = response_text.strip()
        
        result = json.loads(response_text)
        return result
    except Exception as e:
        logging.error(f"Advisory agent error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Advisory agent failed: {str(e)}")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "ET AI Money Mentor API"}

@api_router.post("/submit-profile")
async def submit_profile(profile_input: ProfileInput):
    """Main endpoint that runs all 4 agents sequentially"""
    try:
        session_id = str(uuid.uuid4())
        
        # Convert input to dict
        profile_data = profile_input.model_dump()
        
        # Agent 1: Profiler
        profiler_result = await profiler_agent(profile_data)
        enriched_profile = profiler_result.get('profile', {})
        
        # Agent 2: Scorer
        health_score = await scorer_agent(enriched_profile)
        
        # Agent 3: Tax Calculator
        tax_comparison = await calc_agent(enriched_profile)
        
        # Agent 4: Advisory
        advisory = await advisory_agent(enriched_profile, tax_comparison)
        
        # Save to database
        result_doc = {
            "id": str(uuid.uuid4()),
            "sessionId": session_id,
            "profileData": enriched_profile,
            "healthScore": health_score,
            "taxComparison": tax_comparison,
            "advisory": advisory,
            "createdAt": datetime.now(timezone.utc).isoformat()
        }
        
        await db.agent_results.insert_one(result_doc)
        
        return {
            "sessionId": session_id,
            "profileData": enriched_profile,
            "healthScore": health_score,
            "taxComparison": tax_comparison,
            "advisory": advisory
        }
    except Exception as e:
        logging.error(f"Submit profile error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Retrieve calculation results by session ID"""
    result = await db.agent_results.find_one({"sessionId": session_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Session not found")
    return result

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()