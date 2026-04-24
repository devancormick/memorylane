using RateCalculator.Api.Data;
using RateCalculator.Api.Models;

namespace RateCalculator.Api.Services;

public class RateCalculationService
{
    private const decimal RushMultiplier = 1.5m;

    /// <summary>
    /// Calculate creator day rates for a given base rate, destination, content type, and client type.
    ///
    /// Formula (Direct client):
    ///   cost_day   = base * (1 + overhead/100)
    ///   day_rate   = cost_day / (1 - targetMargin/100)
    ///   rush_rate  = day_rate * 1.5
    ///   profit_day = day_rate - cost_day
    ///   actual_gp  = profit_day / day_rate * 100
    ///
    /// Agency / Platform use a fixed markup instead of the margin formula:
    ///   day_rate = base * (1 + MU/100)
    /// </summary>
    public RateResult Calculate(RateRequest req)
    {
        var market = SeedData.Markets.FirstOrDefault(m => m.Id == req.MarketId)
            ?? throw new ArgumentException($"Unknown destination: {req.MarketId}");

        var config = SeedData.Configs.FirstOrDefault(c => c.MarketId == req.MarketId && c.RoleId == req.RoleId)
            ?? throw new ArgumentException($"No config for destination={req.MarketId} contentType={req.RoleId}");

        var pay      = req.PayRate;
        var overhead = config.OverheadRate;
        var costDay  = pay * (1 + overhead / 100m);

        decimal dayRate = req.CompanyType switch
        {
            "Agency"   => pay * (1 + market.AgencyMU / 100m),
            "Platform" => pay * (1 + market.PlatformMU / 100m),
            _          => costDay / (1 - market.TargetGP / 100m),
        };

        var rushRate   = dayRate * RushMultiplier;
        var profitDay  = dayRate - costDay;
        var actualGP   = dayRate > 0 ? profitDay / dayRate * 100m : 0m;

        return new RateResult(
            PayRate:         Math.Round(pay, 2),
            OverheadRate:    Math.Round(overhead, 1),
            TargetGP:        market.TargetGP,
            MinGP:           market.MinGP,
            CostPerDay:      Math.Round(costDay, 2),
            DayRate:         Math.Round(dayRate, 2),
            RushRate:        Math.Round(rushRate, 2),
            ProfitPerDay:    Math.Round(profitDay, 2),
            ActualGP:        Math.Round(actualGP, 1),
            AtOrAboveTarget: actualGP >= market.TargetGP,
            BelowMin:        actualGP < market.MinGP,
            AvgRate:         config.AvgRate,
            CompanyType:     req.CompanyType
        );
    }
}
