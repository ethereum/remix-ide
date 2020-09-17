## Manage Translation

Here's the list of commands to run in order to update the files which contain translated texts:

This [link](https://docs.readthedocs.io/en/stable/guides/manage-translations.html) details all the steps.

### - If there's no content change:

`sphinx-build -b html -D language=es_AR . _build/html/es_AR` (1)

This need to be run *after* the `po` files are translated and this generate the `mo` files which also need to be pushed to master.
The command above needs to be run for each language.

### - If there are changes in the content:

`sphinx-build -b gettext . _build/gettext`

`sphinx-intl update -p _build/gettext -l es_AR -l pt_BR` (install: `pip install sphinx-intl`)

`-l es_AR -l pt_BR` represents a list of translated files to generate.

Then *after* a `po` file is translated, the command (1) should be run. The `_build/gettext`  folder doesn't need to be pushed to master.
