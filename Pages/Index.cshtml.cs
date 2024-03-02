using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Translate.Services;
using IBM.Watson.LanguageTranslator.v3.Model;

namespace Translate.Pages;

[BindProperties]
public class IndexModel : PageModel
{
    private readonly Translator _translator;

    public IEnumerable<SelectListItem> SourceOptions { get; set; }
    public IEnumerable<SelectListItem> TargetOptions { get; set; }

    public string Text { get; set; } = string.Empty;
    public string SourceId { get; set; } = string.Empty;
    public string TargetId { get; set; } = string.Empty;
    public string Translation { get; set; } = string.Empty;

    public IndexModel(Translator translator)
    {
        _translator = translator;
        SourceOptions = MapLanguageToSelectListItem(_translator.Languages
            .Where(l => l.SupportedAsSource == true));
        TargetOptions = MapLanguageToSelectListItem(_translator.Languages
            .Where(l => l.SupportedAsTarget == true));
    }

    public void OnGet() { }

    public void OnPost()
    {
        var source = _translator.Languages.SingleOrDefault(l => l._Language == SourceId);
        var target = _translator.Languages.SingleOrDefault(l => l._Language == TargetId);
        Translation = _translator.Translate(Text, source, target);

        SourceOptions = MapLanguageToSelectListItem(_translator.Languages
            .Where(l => l.SupportedAsSource == true));
        TargetOptions = MapLanguageToSelectListItem(_translator.Languages
            .Where(l => l.SupportedAsTarget == true));
    }

    private static IEnumerable<SelectListItem> MapLanguageToSelectListItem(IEnumerable<Language> languages)
    {
        return languages.Select(l => new SelectListItem { Value = l._Language, Text = l.LanguageName }).ToList();
    }
}