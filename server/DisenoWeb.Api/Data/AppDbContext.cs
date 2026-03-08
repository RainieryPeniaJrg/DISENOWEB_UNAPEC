using DisenoWeb.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DisenoWeb.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Comentario> Comentarios => Set<Comentario>();
    public DbSet<Hotel> Hotels => Set<Hotel>();
    public DbSet<Imagen> Imagens => Set<Imagen>();
    public DbSet<Pago> Pagos => Set<Pago>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Reaccion> Reaccions => Set<Reaccion>();
    public DbSet<Reservacion> Reservacions => Set<Reservacion>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<SitioTuristico> Sitioturisticos => Set<SitioTuristico>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Valoracion> Valoracions => Set<Valoracion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureUser(modelBuilder);
        ConfigureHotel(modelBuilder);
        ConfigureReservacion(modelBuilder);
        ConfigurePago(modelBuilder);
        ConfigureImagen(modelBuilder);
        ConfigureComentario(modelBuilder);
        ConfigureReaccion(modelBuilder);
        ConfigureValoracion(modelBuilder);
    }

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasOne<Role>()
            .WithMany()
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email);
    }

    private static void ConfigureHotel(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Hotel>()
            .HasOne<SitioTuristico>()
            .WithMany()
            .HasForeignKey(h => h.SitioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Hotel>()
            .HasIndex(h => h.SitioId);
    }

    private static void ConfigureReservacion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reservacion>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(r => r.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reservacion>()
            .HasOne<Hotel>()
            .WithMany()
            .HasForeignKey(r => r.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reservacion>().HasIndex(r => r.UsuarioId);
        modelBuilder.Entity<Reservacion>().HasIndex(r => r.HotelId);
    }

    private static void ConfigurePago(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Pago>()
            .HasOne<Reservacion>()
            .WithMany()
            .HasForeignKey(p => p.ReservacionId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Pago>().HasIndex(p => p.ReservacionId);
    }

    private static void ConfigureImagen(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Imagen>()
            .HasOne<SitioTuristico>()
            .WithMany()
            .HasForeignKey(i => i.SitioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Imagen>()
            .HasOne<Hotel>()
            .WithMany()
            .HasForeignKey(i => i.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Imagen>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(i => i.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Imagen>().HasIndex(i => i.SitioId);
        modelBuilder.Entity<Imagen>().HasIndex(i => i.HotelId);
        modelBuilder.Entity<Imagen>().HasIndex(i => i.UsuarioId);
    }

    private static void ConfigureComentario(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Comentario>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(c => c.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Comentario>()
            .HasOne<SitioTuristico>()
            .WithMany()
            .HasForeignKey(c => c.SitioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Comentario>()
            .HasOne<Hotel>()
            .WithMany()
            .HasForeignKey(c => c.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Comentario>()
            .HasOne<Comentario>()
            .WithMany()
            .HasForeignKey(c => c.ParentComentarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Comentario>().HasIndex(c => c.SitioId);
        modelBuilder.Entity<Comentario>().HasIndex(c => c.HotelId);
        modelBuilder.Entity<Comentario>().HasIndex(c => c.UsuarioId);
        modelBuilder.Entity<Comentario>().HasIndex(c => c.ParentComentarioId);
    }

    private static void ConfigureReaccion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reaccion>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(r => r.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reaccion>()
            .HasOne<SitioTuristico>()
            .WithMany()
            .HasForeignKey(r => r.SitioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reaccion>()
            .HasOne<Hotel>()
            .WithMany()
            .HasForeignKey(r => r.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Reaccion>().HasIndex(r => r.SitioId);
        modelBuilder.Entity<Reaccion>().HasIndex(r => r.HotelId);
        modelBuilder.Entity<Reaccion>().HasIndex(r => r.UsuarioId);
        modelBuilder.Entity<Reaccion>().HasIndex(r => new { r.UsuarioId, r.SitioId, r.HotelId });
    }

    private static void ConfigureValoracion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Valoracion>()
            .HasOne<User>()
            .WithMany()
            .HasForeignKey(v => v.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Valoracion>()
            .HasOne<SitioTuristico>()
            .WithMany()
            .HasForeignKey(v => v.SitioId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Valoracion>()
            .HasOne<Hotel>()
            .WithMany()
            .HasForeignKey(v => v.HotelId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Valoracion>().HasIndex(v => v.SitioId);
        modelBuilder.Entity<Valoracion>().HasIndex(v => v.HotelId);
        modelBuilder.Entity<Valoracion>().HasIndex(v => v.UsuarioId);
        modelBuilder.Entity<Valoracion>().HasIndex(v => new { v.UsuarioId, v.SitioId, v.HotelId });
    }
}
