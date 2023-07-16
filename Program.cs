using Translate.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddSingleton<ITranslator, Translator>();

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

app.MapRazorPages();

app.Run();

static ResponseBody GetTranslation(ITranslator translator, RequestBody body)
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