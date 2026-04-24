using RateCalculator.Api.Models;

namespace RateCalculator.Api.Data;

/// <summary>
/// Seed data for destination regions, content types, and per-destination overhead/avg-rate configs.
/// Overhead rates reflect gear depreciation, travel days, editing time, and software subscriptions.
/// Formula (Direct client):
///   day_rate = base * (1 + overhead/100) / (1 - targetMargin/100)
/// </summary>
public static class SeedData
{
    public static readonly IReadOnlyList<Market> Markets =
    [
        new("europe",    "Europe",             "EU",   38.0m, 33.0m, 72m, 65m),
        new("se-asia",   "SE Asia",            "APAC", 34.0m, 28.0m, 65m, 58m),
        new("n-america", "N. America",         "NA",   40.0m, 35.0m, 75m, 68m),
        new("latam",     "Latin America",      "LATAM",33.0m, 27.0m, 62m, 55m),
        new("japan",     "Japan & Korea",      "APAC", 38.0m, 32.0m, 70m, 63m),
        new("mea",       "Middle East & Africa","MENA", 42.0m, 36.0m, 80m, 72m),
    ];

    public static readonly IReadOnlyList<RoleType> Roles =
    [
        new("photography", "Travel Photography", "Photo",   "camera"),
        new("writing",     "Travel Writing",      "Writing", "writing"),
        new("social",      "Social / Reels",      "Social",  "social"),
    ];

    // OverheadRate: combined gear depreciation + travel costs + editing software %.
    // AvgRate: destination average base day rate for this content type.
    public static readonly IReadOnlyList<MarketRoleConfig> Configs =
    [
        // Europe
        new("europe",    "photography", 42m, 450m),
        new("europe",    "writing",     18m, 300m),
        new("europe",    "social",      28m, 380m),

        // SE Asia
        new("se-asia",   "photography", 38m, 280m),
        new("se-asia",   "writing",     15m, 180m),
        new("se-asia",   "social",      25m, 240m),

        // N. America
        new("n-america", "photography", 45m, 550m),
        new("n-america", "writing",     20m, 350m),
        new("n-america", "social",      30m, 480m),

        // Latin America
        new("latam",     "photography", 35m, 220m),
        new("latam",     "writing",     13m, 140m),
        new("latam",     "social",      22m, 190m),

        // Japan & Korea
        new("japan",     "photography", 40m, 400m),
        new("japan",     "writing",     17m, 250m),
        new("japan",     "social",      27m, 320m),

        // Middle East & Africa
        new("mea",       "photography", 48m, 500m),
        new("mea",       "writing",     22m, 280m),
        new("mea",       "social",      32m, 420m),
    ];
}
