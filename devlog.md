## false start 

* dotnet new webapi -n checkInmate -o checkInmate

right off the bat I get an error that says. 

* warning NU1903: Package 'Microsoft.OpenApi' 2.0.0 has a known high severity vulnerability, https://github.com/advisories/GHSA-v5pm-xwqc-g5wc

I know it is a caution error, but still want to fix it if I can through a simple terminal command.
* dotnet add package Microsoft.OpenApi <----- Fixes it. UPDATE: It does not fix it. Nearly posted it to Slack :(

Nope, broke it. Now I have 2 serious red errors. 
  checkInmate net10.0 failed with 2 error(s) (11.0s)
    C:\2026\capStone\checkInmate\checkInmate\obj\Debug\net10.0\Microsoft.AspNetCore.OpenApi.SourceGenerators\Microsoft.AspNetCore.OpenApi.SourceGenerators.XmlCommentGenerator\OpenApiXmlCommentSupport.generated.cs(399,41): error CS0200: Property or indexer 'IOpenApiMediaType.Example' cannot be assigned to -- it is read only
    C:\2026\capStone\checkInmate\checkInmate\obj\Debug\net10.0\Microsoft.AspNetCore.OpenApi.SourceGenerators\Microsoft.AspNetCore.OpenApi.SourceGenerators.XmlCommentGenerator\OpenApiXmlCommentSupport.generated.cs(461,41): error CS0200: Property or indexer 'IOpenApiMediaType.Example' cannot be assigned to -- it is read only

*? hmmm. I wonder if it's an admin problem. restarting in admin. BACK: no it wasn't an admin issue.

ok so CS0200. "checkInmate\obj\Debug\net10.0\Microsoft.AspNetCore.OpenApi.SourceGenerators\Microsoft.AspNetCore.OpenApi.SourceGenerators.XmlCommentGenerator\OpenApiXmlCommentSupport.generated.cs" (461,41)

wow, it messed it up because I mixed and matched with versions. so now I am removing it and updating ASPNet
* dotnet remove package Microsoft.OpenApi
* dotnet add package Microsoft.AspNetCore.OpenApi

welp, right back to the beginning. still throwing the same NU1903 error from earlier. I know I can start building the API, but getting rid of these yellow colors that grabs the eye would be nice. I feel like I may be digging a hole though.

HA! I just remove the warning visually. Seems cheap, but in my csproj I add this line to the Property 
    <!--- doesn't have a simple fix , supressing -->
    <NoWarn>$(NoWarn);NU1903</NoWarn>

    * Beleive it or not the link it gives to the github advisory explains. 
      https://github.com/advisories/GHSA-v5pm-xwqc-g5wc

## it begins

