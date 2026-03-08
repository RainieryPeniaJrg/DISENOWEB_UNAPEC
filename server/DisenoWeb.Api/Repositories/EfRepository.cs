using DisenoWeb.Api.Data;
using DisenoWeb.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DisenoWeb.Api.Repositories;

public class EfRepository<T>(AppDbContext context) : IRepository<T> where T : class, IEntity, new()
{
    private readonly AppDbContext _context = context;

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _context.Set<T>()
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await _context.Set<T>()
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<T> AddAsync(T entity)
    {
        if (entity.Id == Guid.Empty)
        {
            entity.Id = Guid.NewGuid();
        }

        await _context.Set<T>().AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(T entity)
    {
        var exists = await _context.Set<T>()
            .AsNoTracking()
            .AnyAsync(x => x.Id == entity.Id);

        if (!exists)
        {
            return false;
        }

        _context.Set<T>().Update(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _context.Set<T>().FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
        {
            return false;
        }

        _context.Set<T>().Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
