using Azure;
using Azure.AI.Translation.Text;

namespace Translate.Services;

public record Language(string Id, string Name);
public record TranslationResult(string Translation, string? DetectedLanguage, float? DetectedConfidence);

public class Translator
{
    private TextTranslationClient _client;

    public IEnumerable<Language> Languages =>
        _client.GetSupportedLanguages().Value.Translation.Select(l =>
            new Language(l.Key, l.Value.Name));

    public Translator(IConfiguration config)
    {
        string apiKey = config["Translator:ApiKey"] ?? string.Empty;
        string region = config["Translator:Region"] ?? "eastus";
        _client = new TextTranslationClient(new AzureKeyCredential(apiKey), region);
    }

    public TranslationResult Translate(string? targetId, string? text, string? sourceId)
    {
        if (string.IsNullOrWhiteSpace(targetId) || string.IsNullOrWhiteSpace(text))
            return new TranslationResult(string.Empty, null, null);

        try
        {
            var response = _client.Translate(targetId, text, sourceId);
            return new TranslationResult(
                response.Value[0].Translations[0].Text,
                response.Value[0].DetectedLanguage?.Language,
                response.Value[0].DetectedLanguage?.Confidence);
        }
        catch
        {
            return new TranslationResult(string.Empty, null, null);
        }
    }
}
