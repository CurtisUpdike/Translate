namespace Translate.Models;

public class Translation
{
    public Language SourceLanguage { get; set; }
    public Language TargetLanguage { get; set; }
    public string SourceText { get; set; }
    public string TargetText { get; set; }
}
