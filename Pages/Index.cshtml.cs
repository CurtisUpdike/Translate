using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using IBM.Watson.LanguageTranslator.v3;
using IBM.Cloud.SDK.Core.Authentication.Iam;

namespace Translate.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly IConfiguration _config;
        private readonly LanguageTranslatorService _translator;

        public IndexModel(ILogger<IndexModel> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;

            IamAuthenticator authenticator = new IamAuthenticator(
                apikey: _config["Translator:ApiKey"]
            );

            LanguageTranslatorService languageTranslator = new LanguageTranslatorService("2018-05-01", authenticator);
            languageTranslator.SetServiceUrl(_config["Translator:Url"]);
            languageTranslator.WithHeader("X-Watson-Learning-Opt-Out", "true");
            _translator = languageTranslator;
        }

        public void OnGet()
        {

        }
    }
}