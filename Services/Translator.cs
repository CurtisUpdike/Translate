using IBM.Watson.LanguageTranslator.v3;
using IBM.Cloud.SDK.Core.Authentication.Iam;
using Translate.Models;

namespace Translate.Services;

public class Translator : ITranslator
{
    private LanguageTranslatorService _translator;

    public List<Language> Languages { get; private init; }

    public Translator(IConfiguration config)
    {
        IamAuthenticator authenticator = new IamAuthenticator(
            apikey: config["Translator:ApiKey"]
        );

        _translator = new("2018-05-01", authenticator);
        _translator.SetServiceUrl(config["Translator:Url"]);
        _translator.WithHeader("X-Watson-Learning-Opt-Out", "true");

        Languages = _translator.ListLanguages().Result._Languages.Select(l =>
            new Language
            {
                Id = l._Language.ToString(),
                Name = l.LanguageName,
                SupportedAsSource = l.SupportedAsSource == true,
                SupportedAsTarget = l.SupportedAsTarget == true,
            }
        ).ToList();
    }   

    public Translation Translate(Translation translation)
    {
        var result = _translator.Translate(
            text: new List<string>() { translation.SourceText },
            source: translation.SourceLanguage.Id,
            target: translation.TargetLanguage.Id
        );

        translation.TargetText = result.Result.Translations[0]._Translation;

        return translation;
    }
}
