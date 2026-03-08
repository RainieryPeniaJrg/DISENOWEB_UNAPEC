using System.Text.Json;
using DisenoWeb.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DisenoWeb.Api.Data;

public static class JsonSeedService
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static async Task SeedAsync(AppDbContext dbContext, IWebHostEnvironment env, ILogger logger)
    {
        if (await dbContext.Roles.AnyAsync())
        {
            logger.LogInformation("SQLite seed omitido: ya existen datos.");
            return;
        }

        var storagePath = Path.Combine(env.ContentRootPath, "Data", "storage");
        if (!Directory.Exists(storagePath))
        {
            logger.LogWarning("No se encontró carpeta de seed JSON: {StoragePath}", storagePath);
            return;
        }

        await ImportTableAsync(dbContext.Roles, Path.Combine(storagePath, "roles.json"), dbContext);
        await ImportTableAsync(dbContext.Users, Path.Combine(storagePath, "users.json"), dbContext);
        await ImportTableAsync(dbContext.Sitioturisticos, Path.Combine(storagePath, "sitioturisticos.json"), dbContext);
        await ImportTableAsync(dbContext.Hotels, Path.Combine(storagePath, "hotels.json"), dbContext);
        await ImportTableAsync(dbContext.Reservacions, Path.Combine(storagePath, "reservacions.json"), dbContext);
        await ImportTableAsync(dbContext.Pagos, Path.Combine(storagePath, "pagos.json"), dbContext);
        await ImportTableAsync(dbContext.Products, Path.Combine(storagePath, "products.json"), dbContext);
        await ImportTableAsync(dbContext.Imagens, Path.Combine(storagePath, "imagens.json"), dbContext);
        await ImportTableAsync(dbContext.Comentarios, Path.Combine(storagePath, "comentarios.json"), dbContext);
        await ImportTableAsync(dbContext.Reaccions, Path.Combine(storagePath, "reaccions.json"), dbContext);
        await ImportTableAsync(dbContext.Valoracions, Path.Combine(storagePath, "valoracions.json"), dbContext);

        logger.LogInformation("Seed JSON completado en SQLite.");
    }

    private static async Task ImportTableAsync<TEntity>(
        DbSet<TEntity> dbSet,
        string filePath,
        AppDbContext dbContext) where TEntity : class, IEntity
    {
        if (!File.Exists(filePath))
        {
            return;
        }

        var raw = await File.ReadAllTextAsync(filePath);
        if (string.IsNullOrWhiteSpace(raw))
        {
            return;
        }

        var items = JsonSerializer.Deserialize<List<TEntity>>(raw, SerializerOptions);
        if (items is null || items.Count == 0)
        {
            return;
        }

        await dbSet.AddRangeAsync(items);
        await dbContext.SaveChangesAsync();
    }
}
