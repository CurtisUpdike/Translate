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

app.MapPost("/translate", (Translator translator, TranslateRequestBody body) =>
{
    var result = translator.Translate(body.Text, body.SourceId, body.TargetId);
    return new
    {
        translation = result?.Translations[0]._Translation,
        detectedLanguage = result?.DetectedLanguage,
        detectedConfidence = result?.DetectedLanguageConfidence
    };
});

app.MapGet("/languages", (Translator translator) =>
{
    return translator.Languages.Select(l => new
    {
        id = l._Language,
        name = l.LanguageName,
        supportedAsSource = l.SupportedAsSource,
        supportedAsTarget = l.SupportedAsTarget
    });
});

app.MapRazorPages();

app.Run();

public record TranslateRequestBody(
    string SourceId,
    string TargetId,
    string Text);
