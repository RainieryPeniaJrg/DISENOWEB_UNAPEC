using System.Text.Json;
using DisenoWeb.Api.Data;
using DisenoWeb.Api.Models;
using Microsoft.Extensions.Options;

namespace DisenoWeb.Api.Repositories;

public class JsonFileRepository<T> : IRepository<T> where T : class, IEntity, new()
{
    private readonly string _filePath;
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    };
    private readonly SemaphoreSlim _lock = new(1, 1);

    public JsonFileRepository(IOptions<JsonStorageOptions> options)
    {
        ArgumentNullException.ThrowIfNull(options);
        var basePath = string.IsNullOrWhiteSpace(options.Value.BasePath)
            ? Path.Combine(AppContext.BaseDirectory, "Data", "storage")
            : options.Value.BasePath;

        Directory.CreateDirectory(basePath);
        _filePath = Path.Combine(basePath, $"{typeof(T).Name.ToLowerInvariant()}s.json");

        if (!File.Exists(_filePath))
        {
            File.WriteAllText(_filePath, "[]");
        }
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        await _lock.WaitAsync();
        try
        {
            return await ReadNoLockAsync();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        await _lock.WaitAsync();
        try
        {
            var items = await ReadNoLockAsync();
            return items.FirstOrDefault(x => x.Id == id);
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<T> AddAsync(T entity)
    {
        await _lock.WaitAsync();
        try
        {
            var items = await ReadNoLockAsync();
            if (entity.Id == Guid.Empty)
            {
                entity.Id = Guid.NewGuid();
            }
            items.Add(entity);
            await WriteNoLockAsync(items);
            return entity;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> UpdateAsync(T entity)
    {
        await _lock.WaitAsync();
        try
        {
            var items = await ReadNoLockAsync();
            var index = items.FindIndex(x => x.Id == entity.Id);
            if (index == -1)
            {
                return false;
            }

            items[index] = entity;
            await WriteNoLockAsync(items);
            return true;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        await _lock.WaitAsync();
        try
        {
            var items = await ReadNoLockAsync();
            var removed = items.RemoveAll(x => x.Id == id) > 0;
            if (removed)
            {
                await WriteNoLockAsync(items);
            }
            return removed;
        }
        finally
        {
            _lock.Release();
        }
    }

    private async Task<List<T>> ReadNoLockAsync()
    {
        await using var stream = File.Open(_filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        var items = await JsonSerializer.DeserializeAsync<List<T>>(stream, _serializerOptions);
        return items ?? [];
    }

    private async Task WriteNoLockAsync(List<T> items)
    {
        await using var stream = File.Open(_filePath, FileMode.Create, FileAccess.Write, FileShare.None);
        await JsonSerializer.SerializeAsync(stream, items, _serializerOptions);
    }
}
