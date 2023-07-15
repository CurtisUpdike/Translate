using Translate.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddSingleton<ITranslator, Translator>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapPost("/translate", GetTranslation);

app.MapRazorPages();

app.Run();

static string GetTranslation(ITranslator translator, RequestBody body)
{
    string translation = translator.Translate(body.Text, body.SourceId, body.TargetId);

    return translation;
}

public record RequestBody(
    string SourceId,
    string TargetId,
    string Text);