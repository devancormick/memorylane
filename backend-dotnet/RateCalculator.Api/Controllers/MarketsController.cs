using Microsoft.AspNetCore.Mvc;
using RateCalculator.Api.Data;
using RateCalculator.Api.Models;

namespace RateCalculator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MarketsController : ControllerBase
{
    /// <summary>Returns all markets.</summary>
    [HttpGet]
    public IActionResult GetMarkets() => Ok(SeedData.Markets);

    /// <summary>Returns all role types configured for a specific market.</summary>
    [HttpGet("{marketId}/roles")]
    public IActionResult GetRoles(string marketId)
    {
        var market = SeedData.Markets.FirstOrDefault(m => m.Id == marketId);
        if (market is null) return NotFound($"Market '{marketId}' not found.");

        var roles = SeedData.Configs
            .Where(c => c.MarketId == marketId)
            .Join(SeedData.Roles,
                  c => c.RoleId,
                  r => r.Id,
                  (c, r) => new RoleWithConfig(r, c.BurdenRate, c.AvgPay))
            .ToList();

        return Ok(new MarketWithRoles(market, roles));
    }
}
