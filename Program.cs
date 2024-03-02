using IBM.Watson.LanguageTranslator.v3.Model;
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
{
    TranslationResult? result = null;
    try
    {
        result = translator.Translate(body.Text, body.SourceId, body.TargetId);
    }
    catch {}

    return new
    {
        translation = result?.Translations[0]._Translation,
        detectedLanguage = result?.DetectedLanguage,
        detectedConfidence = result?.DetectedLanguageConfidence
    };
});

app.MapPost("/api/identify", (Translator translator, IdentifyRequestBody body) =>
    translator.Identify(body.Text));

app.MapGet("/api/languages", (Translator translator) =>
    translator.Languages.Select(l => new
    {
        id = l._Language,
        name = l.LanguageName,
        supportedAsSource = l.SupportedAsSource,
        supportedAsTarget = l.SupportedAsTarget
    }));

app.MapRazorPages();

app.Run();

public record TranslateRequestBody(string SourceId, string TargetId, string Text);
public record IdentifyRequestBody(string Text);