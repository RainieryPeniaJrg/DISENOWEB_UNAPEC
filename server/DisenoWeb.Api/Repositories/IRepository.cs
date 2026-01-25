using DisenoWeb.Api.Models;

namespace DisenoWeb.Api.Repositories;

public interface IRepository<T> where T : IEntity
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(Guid id);
    Task<T> AddAsync(T entity);
    Task<bool> UpdateAsync(T entity);
    Task<bool> DeleteAsync(Guid id);
}
