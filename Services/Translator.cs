using IBM.Watson.LanguageTranslator.v3;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using IBM.Watson.LanguageTranslator.v3.Model;

namespace Translate.Services;

public class Translator
{
    private LanguageTranslatorService _translator;

    public IEnumerable<Language> Languages =>
        _translator.ListLanguages().Result._Languages;

    public IEnumerable<Models.Language> SourceLanguages { get; private init; }
    public IEnumerable<Models.Language> TargetLanguages { get; private init; }

    public Translator(IConfiguration config)
    {
        IamAuthenticator authenticator = new IamAuthenticator(
            apikey: config["Translator:ApiKey"]
        );

        _translator = new("2018-05-01", authenticator);
        _translator.SetServiceUrl(config["Translator:Url"]);
        _translator.WithHeader("X-Watson-Learning-Opt-Out", "true");

        SourceLanguages = Languages.Where(l => l.SupportedAsSource == true)
                                   .Select(MapToLanguageModel)
                                   .ToList();

        TargetLanguages = Languages.Where(l => l.SupportedAsTarget == true)
                                   .Select(MapToLanguageModel)
                                   .ToList();
    }

    public string Translate(string text, string sourceId, string targetId)
    {
        if (string.IsNullOrWhiteSpace(text) || string.IsNullOrEmpty(sourceId) || string.IsNullOrEmpty(targetId))
        {
            return string.Empty;
        }

        if (sourceId == targetId)
        {
            return text;
        }

        var result = _translator.Translate(
            text: new() { text },
            source: sourceId,
            target: targetId);

        return result.Result.Translations[0]._Translation;
    }

    private static Models.Language MapToLanguageModel(Language language)
    {
        return new Models.Language(Id: language._Language.ToString(), Name: language.LanguageName);
    }
}
