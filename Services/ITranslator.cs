using Translate.Models;

namespace Translate.Services;

public interface ITranslator
{
    public IEnumerable<Language> SourceLanguages { get; }
    public IEnumerable<Language> TargetLanguages { get; }
    public string Translate(string text, string sourceId, string targetId);
}
