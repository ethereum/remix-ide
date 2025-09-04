# Makefile for Sphinx documentation

# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = $(VENV_DIR)/bin/sphinx-build
SPHINXAUTOBUILD = sphinx-autobuild
PAPER         =
SOURCEDIR     = .
BUILDDIR      = _build
PYTHON        ?= python3
VENV_DIR      ?= .venv
VENV          = $(VENV_DIR)/bin/activate
VALE_CONFIG   = $(ROOT_DIR)/vale.ini
TARGET        = *
ALLFILES      =  *.md **/*.md
ROOT_DIR = ..

# User-friendly check for sphinx-build
ifeq ($(shell which $(SPHINXBUILD) >/dev/null 2>&1; echo $$?), 1)
$(error The '$(SPHINXBUILD)' command was not found. Make sure you have Sphinx installed, \
then set SPHINXBUILD to its full path or add it to PATH. If you don't have Sphinx installed, \
grab it from https://www.sphinx-doc.org/)
endif

# Internal variables.
PAPEROPT_a4     = -D latex_paper_size=a4
PAPEROPT_letter = -D latex_paper_size=letter
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) $(SOURCEDIR)
# the i18n builder cannot share the environment and doctrees with the others
I18NSPHINXOPTS  = $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) $(SOURCEDIR)

.PHONY: help install run clean html dirhtml singlehtml pickle json htmlhelp qthelp applehelp devhelp epub \
        latex latexpdf latexpdfja text man texinfo info gettext changes linkcheck doctest coverage xml pseudoxml \
				vale-install pymarkdownlnt-install lint-md spell-check general-checks

# Help text
help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  install    to create .venv and install doc dependencies (if requirements.txt exists)"
	@echo "  run        to watch, rebuild and serve docs locally (live reload)"
	@echo "  clean      to remove build artifacts"
	@echo "  html       to make standalone HTML files"
	@echo "  dirhtml    to make HTML files named index.html in directories"
	@echo "  singlehtml to make a single large HTML file"
	@echo "  pickle     to make pickle files"
	@echo "  json       to make JSON files"
	@echo "  htmlhelp   to make HTML files and a HTML help project"
	@echo "  qthelp     to make HTML files and a qthelp project"
	@echo "  applehelp  to make an Apple Help Book"
	@echo "  devhelp    to make HTML files and a Devhelp project"
	@echo "  epub       to make an epub"
	@echo "  latex      to make LaTeX files, set PAPER=a4 or PAPER=letter"
	@echo "  latexpdf   to make LaTeX files and run them through pdflatex"
	@echo "  latexpdfja to make LaTeX files and run them through platex/dvipdfmx"
	@echo "  text       to make text files"
	@echo "  man        to make manual pages"
	@echo "  texinfo    to make Texinfo files"
	@echo "  info       to make Texinfo files and run them through makeinfo"
	@echo "  gettext    to make PO message catalogs"
	@echo "  changes    to make an overview of all changed/added/deprecated items"
	@echo "  xml        to make Docutils-native XML files"
	@echo "  pseudoxml  to make pseudoxml-XML files for display purposes"
	@echo "  linkcheck  to check all external links for integrity"
	@echo "  doctest    to run all doctests embedded in the documentation (if enabled)"
	@echo "  coverage   to run coverage check of the documentation (if enabled)"
	@echo "  vale-install       to install Vale for style checking"
	@echo "  pymarkdownlnt-install  to install PyMarkdown linter"
	@echo "  lint-md    to run markdown linting with PyMarkdown"
	@echo "  spell-check        to run Vale spelling checks only"
	@echo "  general-checks     to run Vale general style checks (excluding spelling)"



# Create .venv and install dependencies.
# - If requirements.txt exists -> install from it
# - Else install the bare minimum so `run` works today
install:
	test -d $(VENV_DIR) || $(PYTHON) -m venv $(VENV_DIR)
	. $(VENV); pip install -U pip wheel
	@if [ -f "requirements.txt" ]; then \
	  echo "Installing from requirements.txt ..."; \
	  . $(VENV); pip install -r "requirements.txt"; \
	else \
	  echo "No requirements.txt found; installing minimal deps (sphinx + sphinx-autobuild) ..."; \
	  . $(VENV); pip install -U sphinx sphinx-autobuild; \
	fi

# Live-reload server (watches files, rebuilds on change, serves at 127.0.0.1:8000)
run: install
	@echo "Live docs: http://127.0.0.1:8000 (Ctrl+C to stop)"
	. $(VENV); $(SPHINXAUTOBUILD) -b dirhtml \
		-d $(BUILDDIR)/doctrees $(SPHINXOPTS) \
		--re-ignore '(^|/)(_build|\.venv|venv|node_modules|\.git)/' \
		$(SOURCEDIR) $(BUILDDIR)/dirhtml --open-browser --port 8000

pymarkdownlnt-install:
	@. $(VENV); test -d $(VENV_DIR)/lib/python*/site-packages/pymarkdown || pip install pymarkdownlnt

lint-md: pymarkdownlnt-install
	@. $(VENV); pymarkdownlnt --config $(ROOT_DIR)/.pymarkdown.json scan --recurse --exclude=./$(SPHINXDIR)/** $(SOURCEDIR)

vale-install: install
	@. $(VENV); test -d $(VENV_DIR)/lib/python*/site-packages/vale || pip install vale
	@. $(VENV); test -f $(VALE_CONFIG)
	@. $(VENV); find $(VENV_DIR)/lib/python*/site-packages/vale/vale_bin -size 195c -exec vale --version \;
	@. $(VENV); vale sync

spell-check: vale-install
	@echo "Running Vale spelling check only..."
	@cat $(ROOT_DIR)/.custom_wordlist.txt >> $(ROOT_DIR)/styles/config/vocabularies/Remix/accept.txt
	@. $(VENV); vale --filter='.Extends=="spelling"' --config=$(VALE_CONFIG) $(SOURCEDIR)/*.md > vale-spelling.txt 2>&1 || true
	@echo "Vale spelling results saved to vale-spelling.txt"

general-checks: vale-install
	@echo "General Vale checks"
	@. $(VENV); vale --minAlertLevel=error --filter='.Extends!="spelling"' --config=$(VALE_CONFIG) $(SOURCEDIR)/*.md

clean:
	rm -rf $(BUILDDIR)/*

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
	make -C $(BUILDDIR)/texinfo info
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
