var csjs = require('csjs-inject')

/******************************************************************************
  CSS RESET (= default styling normalization)
******************************************************************************/
csjs`
  html { box-sizing: border-box; }
  
  *, *:before, *:after { box-sizing: inherit; }
  
  body {
    margin: 0;
    padding: 0;
    font: 14px/1.5 Lato, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 12px;
    color: #111111;
    font-weight: normal;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 20px 0 10px;
  }

  p, ul, ol, table, dl {
    margin: 0 0 20px;
  }

  h1, h2, h3 {
    line-height: 1.1;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    color: #393939;
  }

  a {
    color: #39c;
    font-weight: 400;
    text-decoration: none;
  }

  a:hover {
    color: #069;
  }

  a small {
    font-size: 11px;
    color: #777;
    margin-top: -0.6em;
    display: block;
  }

  a:hover small {
    color: #777;
  }

  .wrapper {
    width: 860px;
    margin: 0 auto;
  }

  blockquote {
    border-left: 1px solid #e5e5e5;
    margin: 0;
    padding: 0 0 0 20px;
    font-style: italic;
  }

  code {
    font-family: Monaco, Bitstream Vera Sans Mono, Lucida Console, Terminal, monospace;
    color: #333;
    font-size: 12px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    text-align: left;
    padding: 5px 10px;
    border-bottom: 1px solid #e5e5e5;
  }

  dt {
    color: #444;
    font-weight: 700;
  }

  th {
    color: #444;
  }

  img {
    max-width: 100%;
  }

  header {
    width: 270px;
    float: left;
    position: fixed;
  }

  header ul {
    list-style: none;
    height: 40px;
    padding: 0;
    background: #eee;
    background: -moz-linear-gradient(top, #f8f8f8 0%, #dddddd 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f8f8f8), color-stop(100%, #dddddd));
    background: -webkit-linear-gradient(top, #f8f8f8 0%, #dddddd 100%);
    background: -o-linear-gradient(top, #f8f8f8 0%, #dddddd 100%);
    background: -ms-linear-gradient(top, #f8f8f8 0%, #dddddd 100%);
    background: linear-gradient(top, #f8f8f8 0%, #dddddd 100%);
    border-radius: 5px;
    border: 1px solid #d2d2d2;
    box-shadow: inset #fff 0 1px 0, inset rgba(0, 0, 0, 0.03) 0 -1px 0;
    width: 270px;
  }

  header li {
    width: 89px;
    float: left;
    border-right: 1px solid #d2d2d2;
    height: 40px;
  }

  header li:first-child a {
    border-radius: 5px 0 0 5px;
  }

  header li:last-child a {
    border-radius: 0 5px 5px 0;
  }

  header ul a {
    line-height: 1;
    font-size: 11px;
    color: #999;
    display: block;
    text-align: center;
    padding-top: 6px;
    height: 34px;
  }

  header ul a:hover {
    color: #999;
    background: -moz-linear-gradient(top, #fff 0%, #ddd 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fff), color-stop(100%, #ddd));
    background: -webkit-linear-gradient(top, #fff 0%, #ddd 100%);
    background: -o-linear-gradient(top, #fff 0%, #ddd 100%);
    background: -ms-linear-gradient(top, #fff 0%, #ddd 100%);
    background: linear-gradient(top, #fff 0%, #ddd 100%);
  }

  header ul a:active {
    -webkit-box-shadow: inset 0 2px 2px 0 #ddd;
    -moz-box-shadow: inset 0 2px 2px 0 #ddd;
    box-shadow: inset 0 2px 2px 0 #ddd;
  }

  strong {
    color: #222;
    font-weight: 700;
  }

  header ul li + li {
    width: 88px;
    border-left: 1px solid #fff;
  }

  header ul li + li + li {
    border-right: none;
    width: 89px;
  }

  header ul a strong {
    font-size: 14px;
    display: block;
    color: #222;
  }

  section {
    width: 500px;
    float: right;
    padding-bottom: 50px;
  }

  small {
    font-size: 11px;
  }

  footer {
    width: 270px;
    float: left;
    position: fixed;
    bottom: 50px;
  }

  @media print, screen and (max-width: 960px) {

    div.wrapper {
      width: auto;
      margin: 0;
    }

    header, section, footer {
      float: none;
      position: static;
      width: auto;
    }

    header {
      padding-right:320px;
    }

    section {
      border: 1px solid #e5e5e5;
      border-width: 1px 0;
      padding: 20px 0;
      margin: 0 0 20px;
    }

    header a small {
      display: inline;
    }

    header ul {
      position: absolute;
      right: 50px;
      top: 52px;
    }
  }

  @media print, screen and (max-width: 720px) {
    body {
      word-wrap: break-word;
    }

    header {
      padding: 0;
    }

    header ul, header p.view {
      position: static;
    }

    code {
      word-wrap: normal;
    }
  }

  @media print, screen and (max-width: 480px) {
    body {
      padding: 15px;
    }

    header ul {
      display: none;
    }
  }

  @media print {
    body {
      padding: 0.4in;
      font-size: 12pt;
      color: #444;
    }
  }
`
