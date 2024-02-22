using IBM.Watson.LanguageTranslator.v3;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using IBM.Watson.LanguageTranslator.v3.Model;

namespace Translate.Services;

public class Translator
{
    private LanguageTranslatorService _translator;

    public IEnumerable<Language> Languages =>
        _translator.ListLanguages().Result._Languages;

    public Translator(IConfiguration config)
    {
        _translator = new("2018-05-01", new IamAuthenticator(
            apikey: config["Translator:ApiKey"]));
        _translator.SetServiceUrl(config["Translator:Url"]);
        _translator.WithHeader("X-Watson-Learning-Opt-Out", "true");
    }

    public string Translate(string text, string sourceId, string targetId)
    {
        if (string.IsNullOrWhiteSpace(text) ||
            string.IsNullOrEmpty(targetId))
            return string.Empty;

        if (sourceId == targetId)
            return text;

        var result = _translator.Translate(
            text: new() { text },
            source: sourceId,
            target: targetId);

        return result.Result.Translations[0]._Translation;
    }
}
