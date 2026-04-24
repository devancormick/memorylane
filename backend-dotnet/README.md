# InterSolutions Rate Calculator — .NET Backend

ASP.NET Core 8 Web API that powers the staffing rate calculator.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

## Run

```bash
cd backend-dotnet/RateCalculator.Api
dotnet restore
dotnet run
```

API will be available at `http://localhost:5001`.  
Swagger UI at `http://localhost:5001/swagger`.

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/markets` | All markets |
| GET | `/api/markets/{id}/roles` | Market + its roles with burden/avg-pay |
| POST | `/api/rates/calculate` | Calculate bill rates for one role |
| GET | `/api/rates/market/{id}?companyType=Standard` | Batch rates for all roles in a market |

## Rate Formula

```
Standard:
  cost_hr   = pay × (1 + burden/100)
  std_bill  = cost_hr / (1 − targetGP/100)

Greystar:
  std_bill  = pay × (1 + gsMU/100)

Asset Living:
  std_bill  = pay × (1 + alMU/100)

Both:
  ot_bill   = std_bill × 1.5
  spread_hr = std_bill − cost_hr
  actual_gp = spread_hr / std_bill × 100
```
