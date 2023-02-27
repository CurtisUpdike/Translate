using Translate.Models;

namespace Translate.Services;

public interface ITranslator
{
    public List<Language> Languages { get; }
    public Translation Translate(Translation translation);
}
