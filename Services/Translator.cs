using IBM.Watson.LanguageTranslator.v3;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using IBM.Watson.LanguageTranslator.v3.Model;

namespace Translate.Services;

public class Translator
{
    private LanguageTranslatorService _translator;

    public IEnumerable<Language> Languages =>
        _translator.ListLanguages().Result._Languages;

    public string LanguagesJson => _translator.ListLanguages().Response;

    public Translator(IConfiguration config)
    {
        _translator = new("2018-05-01", new IamAuthenticator(
            apikey: config["Translator:ApiKey"]));
        _translator.SetServiceUrl(config["Translator:Url"]);
        _translator.WithHeader("X-Watson-Learning-Opt-Out", "true");
    }

    public string Translate(string text, Language? source, Language? target)
    {
        if (source == null || target == null) return string.Empty;

        try
        {
            var result = _translator.Translate(
                text: new() { text },
                source: source._Language,
                target: target._Language);

            return result?.Result.Translations[0]._Translation ?? string.Empty;
        }
        catch
        {
            return string.Empty;
        }
    }

    public string Translate(string text, string sourceId, string targetId)
    {
        string EmptyJson = "{}";

        if (string.IsNullOrWhiteSpace(text) || string.IsNullOrEmpty(targetId))
            return EmptyJson;

        if (sourceId == targetId) return text;

        try
        {
            var result = _translator.Translate(
                text: new() { text },
                source: sourceId,
                target: targetId);

            return result.Response;
        }
        catch
        {
            return EmptyJson;
        }
    }

    public string Identify(string text) => _translator.Identify(text).Response;
}
