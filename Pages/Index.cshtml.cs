using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Translate.Services;
using Translate.Models;

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
        SourceOptions = MapLanguageToSelectListItem(_translator.SourceLanguages);
        TargetOptions = MapLanguageToSelectListItem(_translator.TargetLanguages);
    }

    public void OnGet() { }

    public void OnPost()
    {
        Translation = _translator.Translate(Text, SourceId, TargetId);

        SourceOptions = MapLanguageToSelectListItem(_translator.SourceLanguages);
        TargetOptions = MapLanguageToSelectListItem(_translator.TargetLanguages);
    }

    private static IEnumerable<SelectListItem> MapLanguageToSelectListItem(IEnumerable<Language> languages)
    {
        return languages.Select(l => new SelectListItem { Value = l.Id, Text = l.Name }).ToList();
    }
}