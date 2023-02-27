using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Translate.Models;
using Translate.Services;

namespace Translate.Pages;

[BindProperties]
public class IndexModel : PageModel
{
    private readonly ITranslator _translator;

    public List<SelectListItem>? SourceOptions { get; set; }
    public List<SelectListItem>? TargetOptions { get; set; }

    public string SourceLanguage { get; set; } = "en";
    public string TargetLanguage { get; set; } = "es";
    public string SourceText { get; set; } = string.Empty;
    public string TargetText { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;

    public IndexModel(ITranslator translator)
    {
        _translator = translator;
        SetOptions();
    }

    public void OnGet()
    {

    }

    public void OnPost()
    {
        if (SourceLanguage != TargetLanguage)
        {
            var translation = _translator.Translate(new Translation 
                { 
                    SourceLanguage = _translator.Languages.First(l => l.Id == SourceLanguage),
                    TargetLanguage = _translator.Languages.First(l => l.Id == TargetLanguage),
                    SourceText = SourceText
                });

            TargetText = translation.TargetText;
        } 
        else
        { 
            TargetText = SourceText; 
        }

        SetOptions();
    }

    public void SetOptions()
    {
        SourceOptions = (from l in _translator.Languages
                         where l.SupportedAsSource == true
                         orderby l.Name
                         select new SelectListItem { Value = l.Id, Text = l.Name }).ToList();

        TargetOptions = (from l in _translator.Languages
                         where l.SupportedAsTarget == true
                         orderby l.Name
                         select new SelectListItem { Value = l.Id, Text = l.Name }).ToList();
    }
}