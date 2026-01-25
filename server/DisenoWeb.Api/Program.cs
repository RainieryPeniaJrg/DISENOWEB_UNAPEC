using DisenoWeb.Api.Data;
using DisenoWeb.Api.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<JsonStorageOptions>(builder.Configuration.GetSection("JsonStorage"));
builder.Services.PostConfigure<JsonStorageOptions>(opts =>
{
    opts.BasePath = Path.GetFullPath(opts.BasePath, builder.Environment.ContentRootPath);
});
builder.Services.AddSingleton(typeof(IRepository<>), typeof(JsonFileRepository<>));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                  "http://localhost:5173",
                  "https://localhost:5173",
                  "http://localhost:3000",
                  "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/dotnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Ruta basica para verificar vida del servicio
app.MapGet("/", () => Results.Ok(new
{
    message = "DisenoWeb API corriendo",
    version = "v1",
    endpoints = "/api/*"
}));

app.Run();
