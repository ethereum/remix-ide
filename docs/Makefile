# Makefile for Sphinx documentation

# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = $(VENV_DIR)/bin/sphinx-build
SPHINXAUTOBUILD = $(VENV_DIR)/bin/sphinx-autobuild
PAPER         =
SOURCEDIR     = .
BUILDDIR      = _build
PYTHON        ?= python3
VENV_DIR      ?= .venv
VENV          = $(VENV_DIR)/bin/activate
VALE_CONFIG   = $(ROOT_DIR)/vale.ini
ROOT_DIR = ..

# Bootstrap: create venv and install Sphinx only when needed
$(VENV_DIR)/bin/python:
	$(PYTHON) -m venv $(VENV_DIR)
	. $(VENV); pip install -U pip wheel

define install_deps
	@if [ -f "requirements.txt" ]; then \
	  . $(VENV); pip install -r requirements.txt; \
	else \
	  . $(VENV); pip install -U sphinx sphinx-autobuild; \
	fi
endef

$(SPHINXBUILD) $(SPHINXAUTOBUILD): $(VENV_DIR)/bin/python
	$(install_deps)

# Any target that calls sphinx needs the binary ready
SPHINX_TARGETS := html dirhtml singlehtml pickle json htmlhelp qthelp applehelp devhelp epub latex latexpdf latexpdfja text man texinfo info gettext changes linkcheck doctest coverage xml pseudoxml
$(SPHINX_TARGETS): $(SPHINXBUILD)

# Internal variables.
PAPEROPT_a4     = -D latex_paper_size=a4
PAPEROPT_letter = -D latex_paper_size=letter
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) $(SOURCEDIR)
# the i18n builder cannot share the environment and doctrees with the others
I18NSPHINXOPTS  = $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) $(SOURCEDIR)

.PHONY: help install run clean html dirhtml singlehtml pickle json htmlhelp qthelp applehelp devhelp epub \
        latex latexpdf latexpdfja text man texinfo info gettext changes linkcheck doctest coverage xml pseudoxml \
				vale-install pymarkdownlnt-install lint-md spell-check style-checks

# Help text
help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  install    to create .venv and install doc dependencies (if requirements.txt exists)"
	@echo "  run        to watch, rebuild and serve docs locally (live reload)"
	@echo "  clean      to remove build artifacts"
	@echo "  html       to build HTML docs into _build/html/"
	@echo "  dirhtml    to build HTML docs with index.html per directory into _build/dirhtml/"
	@echo "  singlehtml to build all docs into a single HTML page in _build/singlehtml/"
	@echo "  pickle     to build serialized docs for use by other Sphinx tools (in _build/pickle/)"
	@echo "  json       to build docs as JSON fragments for custom frontends (in _build/json/)"
	@echo "  htmlhelp   to build HTML plus a .hhp project file for Windows HTML Help"
	@echo "  qthelp     to build HTML plus a .qhcp project file for Qt Assistant"
	@echo "  applehelp  to build an Apple Help Book for macOS Help Viewer"
	@echo "  devhelp    to build HTML plus a .devhelpproject file for GNOME Devhelp"
	@echo "  epub       to build an .epub e-book suitable for e-readers"
	@echo "  latex      to build LaTeX source files (set PAPER=a4 or PAPER=letter)"
	@echo "  latexpdf   to build LaTeX source files and compile them to PDF with pdflatex"
	@echo "  latexpdfja to build LaTeX source files and compile them to PDF with platex/dvipdfmx"
	@echo "  text       to build plain-text versions of all pages into _build/text/"
	@echo "  man        to build Unix man pages into _build/man/ (install with man -l)"
	@echo "  texinfo    to build Texinfo source files into _build/texinfo/"
	@echo "  info       to build Texinfo source files and compile them to .info with makeinfo"
	@echo "  gettext    to extract translatable strings into .pot files in _build/locale/"
	@echo "  changes    to make an overview of all changed/added/deprecated items"
	@echo "  xml        to make Docutils-native XML files"
	@echo "  pseudoxml  to make pseudoxml-XML files for display purposes"
	@echo "  linkcheck  to check all external links for integrity"
	@echo "  doctest    to run all doctests embedded in the documentation (if enabled)"
	@echo "  coverage   to report which Python objects lack documentation (requires coverage extension)"
	@echo "  vale-install       to install Vale for style checking"
	@echo "  pymarkdownlnt-install  to install PyMarkdown linter"
	@echo "  lint-md    to run markdown linting with PyMarkdown"
	@echo "  spell-check        to run Vale spelling checks only"
	@echo "  style-checks     to run Vale general style checks (excluding spelling)"



# Create .venv and install dependencies.
# - If requirements.txt exists -> install from it
# - Else install the bare minimum so `run` works today
install: $(SPHINXBUILD) $(SPHINXAUTOBUILD)


# Live-reload server (watches files, rebuilds on change, serves at 127.0.0.1:8000)
run: $(SPHINXAUTOBUILD)
	@echo "Live docs: http://127.0.0.1:8000 (Ctrl+C to stop)"
	. $(VENV); $(SPHINXAUTOBUILD) -b dirhtml \
		-d $(BUILDDIR)/doctrees $(SPHINXOPTS) \
		--re-ignore '(^|/)(_build|\.venv|venv|node_modules|\.git)/' \
		$(SOURCEDIR) $(BUILDDIR)/dirhtml --open-browser --port 8000

pymarkdownlnt-install:
	@. $(VENV); test -d $(VENV_DIR)/lib/python*/site-packages/pymarkdown || pip install pymarkdownlnt

lint-md: pymarkdownlnt-install
	@. $(VENV); pymarkdownlnt --config $(ROOT_DIR)/.pymarkdown.json scan \
	  --recurse \
	  --exclude='./$(BUILDDIR)/**' \
	  --exclude='./$(VENV_DIR)/**' \
	  --exclude='./.git/**' \
	  $(SOURCEDIR)

.vale-stamp: $(VENV_DIR)/bin/python
	@. $(VENV); pip install vale==3.21.0.0
	@test -f $(VALE_CONFIG)
	@. $(VENV); vale sync
	@touch .vale-stamp

vale-install: .vale-stamp

spell-check: vale-install
	@echo "Running Vale spelling check only..."
	@tmp_dir=$$(mktemp -d); \
	  cp -r $(ROOT_DIR)/styles $$tmp_dir/; \
	  cat $(ROOT_DIR)/styles/config/vocabularies/Remix/accept.txt \
	      $(ROOT_DIR)/.custom_wordlist.txt \
	    | sort -u > $$tmp_dir/styles/config/vocabularies/Remix/accept.txt; \
	  sed "s|StylesPath[[:space:]]*=.*|StylesPath = $$tmp_dir/styles|" \
	    $(VALE_CONFIG) > $$tmp_dir/vale.ini; \
	  . $(VENV); vale --filter='.Extends=="spelling"' \
	    --config=$$tmp_dir/vale.ini $$(find $(SOURCEDIR) -name '*.md' -not -path '*/.venv/*' -not -path '*/_build/*' -not -path '*/locale/*') > vale-spelling.txt 2>&1 || true; \
	  rm -rf $$tmp_dir
	@echo "Vale spelling results saved to vale-spelling.txt"

style-checks: vale-install
	@echo "General Vale checks"
	@. $(VENV); vale --minAlertLevel=error --filter='.Extends!="spelling"' --config=$(VALE_CONFIG) $$(find $(SOURCEDIR) -name '*.md' -not -path '*/.venv/*' -not -path '*/_build/*' -not -path '*/locale/*')

clean:
	rm -rf $(BUILDDIR)/dirhtml && rm -rf $(BUILDDIR)/doctrees

html:
	$(SPHINXBUILD) -b html $(ALLSPHINXOPTS) $(BUILDDIR)/html
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/html."

dirhtml:
	$(SPHINXBUILD) -b dirhtml $(ALLSPHINXOPTS) $(BUILDDIR)/dirhtml
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/dirhtml."

singlehtml:
	$(SPHINXBUILD) -b singlehtml $(ALLSPHINXOPTS) $(BUILDDIR)/singlehtml
	@echo
	@echo "Build finished. The HTML page is in $(BUILDDIR)/singlehtml."

pickle:
	$(SPHINXBUILD) -b pickle $(ALLSPHINXOPTS) $(BUILDDIR)/pickle
	@echo
	@echo "Build finished; now you can process the pickle files."

json:
	$(SPHINXBUILD) -b json $(ALLSPHINXOPTS) $(BUILDDIR)/json
	@echo
	@echo "Build finished; now you can process the JSON files."

htmlhelp:
	$(SPHINXBUILD) -b htmlhelp $(ALLSPHINXOPTS) $(BUILDDIR)/htmlhelp
	@echo
	@echo "Build finished; now you can run HTML Help Workshop with the" \
	      ".hhp project file in $(BUILDDIR)/htmlhelp."

qthelp:
	$(SPHINXBUILD) -b qthelp $(ALLSPHINXOPTS) $(BUILDDIR)/qthelp
	@echo
	@echo "Build finished; now you can run qcollectiongenerator with the" \
	      ".qhcp project file in $(BUILDDIR)/qthelp, like this:"
	@echo "# qcollectiongenerator $(BUILDDIR)/qthelp/Remix.qhcp"
	@echo "To view the help file:"
	@echo "# assistant -collectionFile $(BUILDDIR)/qthelp/Remix.qhc"

applehelp:
	$(SPHINXBUILD) -b applehelp $(ALLSPHINXOPTS) $(BUILDDIR)/applehelp
	@echo
	@echo "Build finished. The help book is in $(BUILDDIR)/applehelp."

devhelp:
	$(SPHINXBUILD) -b devhelp $(ALLSPHINXOPTS) $(BUILDDIR)/devhelp
	@echo
	@echo "Build finished."

epub:
	$(SPHINXBUILD) -b epub $(ALLSPHINXOPTS) $(BUILDDIR)/epub
	@echo
	@echo "Build finished. The epub file is in $(BUILDDIR)/epub."

latex:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex
	@echo
	@echo "Build finished; the LaTeX files are in $(BUILDDIR)/latex."
	@echo "Run \`make' in that directory to run these through (pdf)latex" \
	      "(use \`make latexpdf' here to do that automatically)."

latexpdf:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex
	@echo "Running LaTeX files through pdflatex..."
	$(MAKE) -C $(BUILDDIR)/latex all-pdf
	@echo "pdflatex finished; the PDF files are in $(BUILDDIR)/latex."

latexpdfja:
	$(SPHINXBUILD) -b latex $(ALLSPHINXOPTS) $(BUILDDIR)/latex
	@echo "Running LaTeX files through platex and dvipdfmx..."
	$(MAKE) -C $(BUILDDIR)/latex all-pdf-ja
	@echo "pdflatex finished; the PDF files are in $(BUILDDIR)/latex."

text:
	$(SPHINXBUILD) -b text $(ALLSPHINXOPTS) $(BUILDDIR)/text
	@echo
	@echo "Build finished. The text files are in $(BUILDDIR)/text."

man:
	$(SPHINXBUILD) -b man $(ALLSPHINXOPTS) $(BUILDDIR)/man
	@echo
	@echo "Build finished. The manual pages are in $(BUILDDIR)/man."

texinfo:
	$(SPHINXBUILD) -b texinfo $(ALLSPHINXOPTS) $(BUILDDIR)/texinfo
	@echo
	@echo "Build finished. The Texinfo files are in $(BUILDDIR)/texinfo."
	@echo "Run \`make' in that directory to run these through makeinfo" \
	      "(use \`make info' here to do that automatically)."

info:
	$(SPHINXBUILD) -b texinfo $(ALLSPHINXOPTS) $(BUILDDIR)/texinfo
	@echo "Running Texinfo files through makeinfo..."
	$(MAKE) -C $(BUILDDIR)/texinfo info
	@echo "makeinfo finished; the Info files are in $(BUILDDIR)/texinfo."

gettext:
	$(SPHINXBUILD) -b gettext $(I18NSPHINXOPTS) $(BUILDDIR)/locale
	@echo
	@echo "Build finished. The message catalogs are in $(BUILDDIR)/locale."

changes:
	$(SPHINXBUILD) -b changes $(ALLSPHINXOPTS) $(BUILDDIR)/changes
	@echo
	@echo "The overview file is in $(BUILDDIR)/changes."

linkcheck:
	$(SPHINXBUILD) -b linkcheck $(ALLSPHINXOPTS) $(BUILDDIR)/linkcheck
	@echo
	@echo "Link check complete; see $(BUILDDIR)/linkcheck/output.txt."

doctest:
	$(SPHINXBUILD) -b doctest $(ALLSPHINXOPTS) $(BUILDDIR)/doctest
	@echo "Doctests finished; see $(BUILDDIR)/doctest/output.txt."

coverage:
	$(SPHINXBUILD) -b coverage $(ALLSPHINXOPTS) $(BUILDDIR)/coverage
	@echo "Coverage finished; see $(BUILDDIR)/coverage/python.txt."

xml:
	$(SPHINXBUILD) -b xml $(ALLSPHINXOPTS) $(BUILDDIR)/xml
	@echo
	@echo "Build finished. The XML files are in $(BUILDDIR)/xml."

pseudoxml:
	$(SPHINXBUILD) -b pseudoxml $(ALLSPHINXOPTS) $(BUILDDIR)/pseudoxml
	@echo
	@echo "Build finished. The pseudo-XML files are in $(BUILDDIR)/pseudoxml."
