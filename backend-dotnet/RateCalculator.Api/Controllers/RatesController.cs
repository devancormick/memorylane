using Microsoft.AspNetCore.Mvc;
using RateCalculator.Api.Models;
using RateCalculator.Api.Services;

namespace RateCalculator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatesController : ControllerBase
{
    private readonly RateCalculationService _svc;

    public RatesController(RateCalculationService svc) => _svc = svc;

    /// <summary>
    /// Calculate billing rates for a given pay rate, market, role, and company type.
    /// POST /api/rates/calculate
    /// Body: { marketId, roleId, payRate, companyType }
    /// </summary>
    [HttpPost("calculate")]
    public IActionResult Calculate([FromBody] RateRequest req)
    {
        try
        {
            var result = _svc.Calculate(req);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Batch-calculate rates for all roles in a market at their default avg pay.
    /// GET /api/rates/market/{marketId}?companyType=Standard
    /// </summary>
    [HttpGet("market/{marketId}")]
    public IActionResult GetMarketRates(string marketId, [FromQuery] string companyType = "Standard")
    {
        try
        {
            var results = Data.SeedData.Configs
                .Where(c => c.MarketId == marketId)
                .Select(c => new
                {
                    roleId = c.RoleId,
                    result = _svc.Calculate(new RateRequest(marketId, c.RoleId, c.AvgPay, companyType))
                })
                .ToList();
            return Ok(results);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
