namespace Translate.Models;

public class Language
{
    public string Id { get; set; }
    public string Name { get; set; }
    public bool SupportedAsSource { get; set; }
    public bool SupportedAsTarget { get; set; }
}
