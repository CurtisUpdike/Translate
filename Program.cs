using Translate.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddSingleton<Translator>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapPost("/api/translate", (Translator translator, TranslateRequestBody body) =>
    translator.Translate(body.Text, body.SourceId, body.TargetId));

app.MapPost("/api/identify", (Translator translator, IdentifyRequestBody body) =>
    translator.Identify(body.Text));

app.MapGet("/api/languages", (Translator translator) => translator.LanguagesJson);

app.MapRazorPages();

app.Run();

public record TranslateRequestBody(string SourceId, string TargetId, string Text);
public record IdentifyRequestBody(string Text);