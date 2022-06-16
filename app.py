from dotenv import load_dotenv
import os
from flask import Flask, render_template, request
from ibm_watson import LanguageTranslatorV3
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

load_dotenv()
app = Flask(__name__)

language_translator = LanguageTranslatorV3(
    version=os.environ['VERSION'],
    authenticator=IAMAuthenticator(os.environ['API_KEY'])
)
language_translator.set_service_url(os.environ['URL'])
language_translator.set_default_headers({'x-watson-learning-opt-out': "true"})


@app.route('/')
def index():
    languages = language_translator.list_languages().get_result()['languages']
    languages = sorted(languages, key=lambda d: d['language_name'])
    return render_template('index.html', languages=languages)


@app.route('/translate', methods=['POST'])
def translate():
    translation = language_translator.translate(
        text=request.form.get('text'),
        target=request.form.get('target'),
        source=request.form.get('source')
    ).get_result()
    return translation
