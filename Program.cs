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

app.MapPost("/translate", GetTranslation);

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

static ResponseBody GetTranslation(Translator translator, RequestBody body)
{
    string translation = translator.Translate(body.Text, body.SourceId, body.TargetId);

    return new ResponseBody(translation);
}

public record RequestBody(
    string SourceId,
    string TargetId,
    string Text);

public record ResponseBody(
    string Translation);