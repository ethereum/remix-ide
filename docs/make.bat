@ECHO OFF

REM Command file for Sphinx documentation

REM You can set these variables from the command line.
if "%SPHINXBUILD%" == "" (
	set SPHINXBUILD=sphinx-build
)
if "%SPHINXAUTOBUILD%" == "" (
	set SPHINXAUTOBUILD=sphinx-autobuild
)
set PAPER=
set SOURCEDIR=.
set BUILDDIR=_build

REM Optional: Python/requirements for a local venv
if "%PYTHON%" == "" (
	set PYTHON=python
)
if "%VENV_DIR%" == "" (
	set VENV_DIR=.venv
)
if "%REQ%" == "" (
	set REQ=requirements.txt
)

set ALLSPHINXOPTS=-d %BUILDDIR%/doctrees %SPHINXOPTS% %SOURCEDIR%
set I18NSPHINXOPTS=%SPHINXOPTS% %SOURCEDIR%
if NOT "%PAPER%" == "" (
	set ALLSPHINXOPTS=-D latex_paper_size=%PAPER% %ALLSPHINXOPTS%
	set I18NSPHINXOPTS=-D latex_paper_size=%PAPER% %I18NSPHINXOPTS%
)

REM User-friendly check for sphinx-build
%SPHINXBUILD% 1>NUL 2>NUL
if errorlevel 9009 goto sphinx_python
goto sphinx_ok

:sphinx_python
set SPHINXBUILD=python -m sphinx.__init__
%SPHINXBUILD% 2> nul
if errorlevel 9009 (
	echo.
	echo.The 'sphinx-build' command was not found. Make sure you have Sphinx
	echo.installed, then set SPHINXBUILD to its full path or add it to PATH.
	echo.If you don't have Sphinx installed, grab it from https://www.sphinx-doc.org/
	exit /b 1
)

:sphinx_ok

if "%1" == "" goto help

if "%1" == "help" (
	:help
	echo.Please use `make ^<target^>` where ^<target^> is one of
	echo.  install    to create .venv and install doc dependencies (if requirements.txt exists)
	echo.  run        to watch, rebuild and serve docs locally (live reload)
	echo.  html       to make standalone HTML files
	echo.  dirhtml    to make HTML files named index.html in directories
	echo.  singlehtml to make a single large HTML file
	echo.  pickle     to make pickle files
	echo.  json       to make JSON files
	echo.  htmlhelp   to make HTML files and a HTML help project
	echo.  qthelp     to make HTML files and a qthelp project
	echo.  applehelp  to make an Apple Help Book
	echo.  devhelp    to make HTML files and a Devhelp project
	echo.  epub       to make an epub
	echo.  latex      to make LaTeX files, set PAPER=a4 or PAPER=letter
	echo.  latexpdf   to make LaTeX files and run them through pdflatex
	echo.  latexpdfja to make LaTeX files and run them through platex/dvipdfmx
	echo.  text       to make text files
	echo.  man        to make manual pages
	echo.  texinfo    to make Texinfo files
	echo.  info       to make Texinfo files and run them through makeinfo
	echo.  gettext    to make PO message catalogs
	echo.  changes    to make an overview of all changed/added/deprecated items
	echo.  xml        to make Docutils-native XML files
	echo.  pseudoxml  to make pseudoxml-XML files for display purposes
	echo.  linkcheck  to check all external links for integrity
	echo.  doctest    to run all doctests embedded in the documentation (if enabled)
	echo.  coverage   to run coverage check of the documentation (if enabled)
	goto end
)

if "%1" == "install" (
	if not exist %VENV_DIR% (
		%PYTHON% -m venv %VENV_DIR%
	)
	call %VENV_DIR%\Scripts\activate.bat
	pip install -U pip wheel
	if exist "%REQ%" (
		echo Installing from %REQ% ...
		pip install -r "%REQ%"
	) else (
		echo No %REQ% found; installing minimal deps (sphinx + sphinx-autobuild) ...
		pip install -U sphinx sphinx-autobuild
	)
	goto end
)

if "%1" == "run" (
	if not exist %VENV_DIR% (
		call make.bat install
	)
	echo Live docs: http://127.0.0.1:8000 (Ctrl+C to stop)
	call %VENV_DIR%\Scripts\activate.bat
	%SPHINXAUTOBUILD% -b dirhtml -d %BUILDDIR%/doctrees %SPHINXOPTS% --re-ignore "(^|/)(_build|\.venv|venv|node_modules|\.git)/" %SOURCEDIR% %BUILDDIR%/dirhtml --open-browser --port 8000
	goto end
)

if "%1" == "clean" (
	for /d %%i in (%BUILDDIR%\*) do rmdir /q /s %%i
	del /q /s %BUILDDIR%\*
	goto end
)

if "%1" == "html" (
	%SPHINXBUILD% -b html %ALLSPHINXOPTS% %BUILDDIR%/html
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The HTML pages are in %BUILDDIR%/html.
	goto end
)

if "%1" == "dirhtml" (
	%SPHINXBUILD% -b dirhtml %ALLSPHINXOPTS% %BUILDDIR%/dirhtml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The HTML pages are in %BUILDDIR%/dirhtml.
	goto end
)

if "%1" == "singlehtml" (
	%SPHINXBUILD% -b singlehtml %ALLSPHINXOPTS% %BUILDDIR%/singlehtml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The HTML page is in %BUILDDIR%/singlehtml.
	goto end
)

if "%1" == "pickle" (
	%SPHINXBUILD% -b pickle %ALLSPHINXOPTS% %BUILDDIR%/pickle
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can process the pickle files.
	goto end
)

if "%1" == "json" (
	%SPHINXBUILD% -b json %ALLSPHINXOPTS% %BUILDDIR%/json
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can process the JSON files.
	goto end
)

if "%1" == "htmlhelp" (
	%SPHINXBUILD% -b htmlhelp %ALLSPHINXOPTS% %BUILDDIR%/htmlhelp
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can run HTML Help Workshop with the ^
.hhp project file in %BUILDDIR%/htmlhelp.
	goto end
)

if "%1" == "qthelp" (
	%SPHINXBUILD% -b qthelp %ALLSPHINXOPTS% %BUILDDIR%/qthelp
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; now you can run qcollectiongenerator with the ^
.qhcp project file in %BUILDDIR%/qthelp, like this:
	echo.# qcollectiongenerator %BUILDDIR%\qthelp\Remix.qhcp
	echo.To view the help file:
	echo.# assistant -collectionFile %BUILDDIR%\qthelp\Remix.qhc
	goto end
)

if "%1" == "applehelp" (
	%SPHINXBUILD% -b applehelp %ALLSPHINXOPTS% %BUILDDIR%/applehelp
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The help book is in %BUILDDIR%/applehelp.
	goto end
)

if "%1" == "devhelp" (
	%SPHINXBUILD% -b devhelp %ALLSPHINXOPTS% %BUILDDIR%/devhelp
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished.
	goto end
)

if "%1" == "epub" (
	%SPHINXBUILD% -b epub %ALLSPHINXOPTS% %BUILDDIR%/epub
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The epub file is in %BUILDDIR%/epub.
	goto end
)

if "%1" == "latex" (
	%SPHINXBUILD% -b latex %ALLSPHINXOPTS% %BUILDDIR%/latex
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished; the LaTeX files are in %BUILDDIR%/latex.
	echo.Run `make` in that directory to run these through (pdf)latex ^
(use `make latexpdf` here to do that automatically).
	goto end
)

if "%1" == "latexpdf" (
	%SPHINXBUILD% -b latex %ALLSPHINXOPTS% %BUILDDIR%/latex
	echo.Running LaTeX files through pdflatex...
	cd %BUILDDIR%/latex
	make all-pdf
	cd %~dp0
	echo.pdflatex finished; the PDF files are in %BUILDDIR%/latex.
	goto end
)

if "%1" == "latexpdfja" (
	%SPHINXBUILD% -b latex %ALLSPHINXOPTS% %BUILDDIR%/latex
	echo.Running LaTeX files through platex and dvipdfmx...
	cd %BUILDDIR%/latex
	make all-pdf-ja
	cd %~dp0
	echo.pdflatex finished; the PDF files are in %BUILDDIR%/latex.
	goto end
)

if "%1" == "text" (
	%SPHINXBUILD% -b text %ALLSPHINXOPTS% %BUILDDIR%/text
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The text files are in %BUILDDIR%/text.
	goto end
)

if "%1" == "man" (
	%SPHINXBUILD% -b man %ALLSPHINXOPTS% %BUILDDIR%/man
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The manual pages are in %BUILDDIR%/man.
	goto end
)

if "%1" == "texinfo" (
	%SPHINXBUILD% -b texinfo %ALLSPHINXOPTS% %BUILDDIR%/texinfo
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The Texinfo files are in %BUILDDIR%/texinfo.
	echo.Run `make` in that directory to run these through makeinfo ^
(use `make info` here to do that automatically).
	goto end
)

if "%1" == "info" (
	%SPHINXBUILD% -b texinfo %ALLSPHINXOPTS% %BUILDDIR%/texinfo
	echo.Running Texinfo files through makeinfo...
	cd %BUILDDIR%/texinfo
	make info
	cd %~dp0
	echo.makeinfo finished; the Info files are in %BUILDDIR%/texinfo.
	goto end
)

if "%1" == "gettext" (
	%SPHINXBUILD% -b gettext %I18NSPHINXOPTS% %BUILDDIR%/locale
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The message catalogs are in %BUILDDIR%/locale.
	goto end
)

if "%1" == "changes" (
	%SPHINXBUILD% -b changes %ALLSPHINXOPTS% %BUILDDIR%/changes
	if errorlevel 1 exit /b 1
	echo.
	echo.The overview file is in %BUILDDIR%/changes.
	goto end
)

if "%1" == "linkcheck" (
	%SPHINXBUILD% -b linkcheck %ALLSPHINXOPTS% %BUILDDIR%/linkcheck
	if errorlevel 1 exit /b 1
	echo.
	echo.Link check complete; see %BUILDDIR%/linkcheck/output.txt.
	goto end
)

if "%1" == "doctest" (
	%SPHINXBUILD% -b doctest %ALLSPHINXOPTS% %BUILDDIR%/doctest
	if errorlevel 1 exit /b 1
	echo.Doctests finished; see %BUILDDIR%/doctest/output.txt.
	goto end
)

if "%1" == "coverage" (
	%SPHINXBUILD% -b coverage %ALLSPHINXOPTS% %BUILDDIR%/coverage
	if errorlevel 1 exit /b 1
	echo.Coverage finished; see %BUILDDIR%/coverage/python.txt.
	goto end
)

if "%1" == "xml" (
	%SPHINXBUILD% -b xml %ALLSPHINXOPTS% %BUILDDIR%/xml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The XML files are in %BUILDDIR%/xml.
	goto end
)

if "%1" == "pseudoxml" (
	%SPHINXBUILD% -b pseudoxml %ALLSPHINXOPTS% %BUILDDIR%/pseudoxml
	if errorlevel 1 exit /b 1
	echo.
	echo.Build finished. The pseudo-XML files are in %BUILDDIR%/pseudoxml.
	goto end
)

:end
