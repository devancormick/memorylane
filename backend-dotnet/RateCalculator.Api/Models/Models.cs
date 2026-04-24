namespace RateCalculator.Api.Models;

public record Market(
    string Id,
    string Name,
    string Region,      // geographic region code, e.g. "EU"
    decimal TargetGP,   // target profit margin %
    decimal MinGP,      // floor margin — negotiate or decline below
    decimal AgencyMU,   // agency booking markup %
    decimal PlatformMU  // content platform fee markup %
);

public record RoleType(
    string Id,
    string Name,
    string Category,
    string Icon
);

/// <summary>Per-destination, per-content-type config (overhead rate and average base day rate).</summary>
public record MarketRoleConfig(
    string MarketId,
    string RoleId,
    decimal OverheadRate,  // % — gear depreciation + travel costs + editing software
    decimal AvgRate        // destination average base day rate for this content type
);

public record RateRequest(
    string MarketId,
    string RoleId,
    decimal PayRate,
    string CompanyType = "Direct"  // Direct | Agency | Platform
);

public record RateResult(
    decimal PayRate,
    decimal OverheadRate,
    decimal TargetGP,
    decimal MinGP,
    decimal CostPerDay,
    decimal DayRate,
    decimal RushRate,
    decimal ProfitPerDay,
    decimal ActualGP,
    bool AtOrAboveTarget,
    bool BelowMin,
    decimal AvgRate,
    string CompanyType
);

public record MarketWithRoles(
    Market Market,
    IReadOnlyList<RoleWithConfig> Roles
);

public record RoleWithConfig(
    RoleType Role,
    decimal OverheadRate,
    decimal AvgRate
);
