'use babel';

import { Emitter } from 'atom';

const ftoc_patterns = require('./atom-file-toc-ftoc');
const regex_patterns = require('./atom-file-toc-searchex');

export default class AtomFileTocView {
  modalElement:null;
  lang_ftoc:null;
  lang_regex:null;
  file_grammar:null;
  //ftoc-1 Testing
  constructor(serializedState) {
    this.emitter = new Emitter();

    // Create root element
    this.modalElement = document.createElement('div');
    this.modalElement.classList.add('atom-file-toc');

    this.subscriptions = atom.workspace.getCenter().observeActivePaneItem(item => {
      if(!atom.workspace.isTextEditor(item)) return;
      while(this.modalElement.firstChild) {
        this.modalElement.removeChild(this.modalElement.firstChild);
      }

      // Get the language grammar of the active file
      let fileGrammar = item.getGrammar();
      this.file_grammar = item.getGrammar();
      //console.log("Loaded File Grammar");
      //console.log(this.file_grammar);
      let file_language = fileGrammar.name.toLowerCase();


      let fileGrammarSet = atom.grammars.getGrammars().filter((grammar) => {
        //return grammar !== atom.grammars.nullGrammar && grammar.name === fileGrammar.name;
        return grammar.name === fileGrammar.name;
      })

      /* NOTE: Testing Grammar Set */
      //console.log("fileGrammarSet");
      //console.log(fileGrammarSet[0]);
      //for (pattern of fileGrammarSet[0]['initialRule']['patterns']) {
      //  console.log(pattern["scopeName"]);
      //}
      this.loadGrammarSet(file_language);


      this.modalElement.innerHTML = `
      <div name='toc-file-summary' style='display:flex;flex-direction:column;border-bottom:1px solid whitesmoke;'>
        <h2><i class="icon icon-file"></i>${item.getFileName() || 'untitled'}</h2>
        <ul>
          <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
          <li><b>Tab Length:</b> ${item.getTabLength()}</li>
          <li><b>Encoding:</b> ${item.getEncoding()}</li>
          <li><b>Line Count:</b> ${item.getLineCount()}</li>
          <li><b>Language:</b> ${fileGrammar.name}</li>
        </ul>
      </div>
      `;

      filetoc = this.buildTocInfo(item);
      this.modalElement.appendChild(filetoc);
    })

    this.emitter.on('toc-goto-line',(val) => {
      this.gotoTocResult(val);
    });
  }

  loadGrammarSet(file_language) {
    if (ftoc_patterns.hasOwnProperty(file_language)) {
      console.log("Got FTOC patterns for: " + file_language);
      this.lang_ftoc = ftoc_patterns[file_language];
    } else {
      this.lang_ftoc = null;
    }

    if (regex_patterns.hasOwnProperty(file_language)) {
      console.log("Got regex patterns for: " + file_language);
      this.lang_regex = regex_patterns[file_language];
    } else {
      this.lang_regex = null;
    }
  }

  getTitle() {
    return 'File Table Of Contents';
  }

  getDefaultLocation() {
    return 'bottom';
  }

  getAllowedLocations() {
    return ['left','right','bottom'];
  }

  getURI(){
    return 'atom://atom-file-toc';
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {
    return {
      deserializer: 'atom-file-toc/AtomFileTocView'
    }
  }

  // Tear down any state and detach
  destroy() {
    this.modalElement.remove();
    this.subscriptions.dispose();
  }

  getElement() {
    return this.modalElement;
  }

  buildTocInfo(item) {
    let toccer = Object.assign([]);
    let ftoc_style_re = new RegExp('\\bftoc-\\b\\d*');
    let ftoc_value_re = new RegExp('^.*\\bftoc-\\b\\d*\\s*');
    let line_css = 'atom-file-toc-line';
    let ftoc_css_prefix = 'atom-file-toc-';
    //const ftoc_icon = '<i class="icon icon-bookmark" style="font-size:8px;"></i>';
    const ftoc_icon = '<i class=""></i>';
    const line_icon = '<i class=""></i>';

    for(let i=0;i<=item.getScreenLineCount();i++) {
      let line = item.lineTextForScreenRow(i);
      if(typeof(line) === 'undefined') { continue }

      if(this.testLineFtoc(line)) {
        let ftoc_css = line.match(ftoc_style_re);
        ftoc_css = ftoc_css[0];
        ftoc_css = ftoc_css_prefix + ftoc_css;
        let ftoc_value = line.split(ftoc_value_re);
        //console.log(line);
        //console.log(ftoc_value);
        if(ftoc_value.length == 2) {
          ftoc_value = ftoc_value[1];
        } else {
          ftoc_value = '?Undefined?';
        }
        toccer.push([i, ftoc_value, ftoc_css, ftoc_icon, true]);
        continue;
      }

      let test_regex = this.testLineRegex(line);
      if (test_regex) { toccer.push([i, line, line_css, line_icon, false]) };
    };
    return this.createTocModal(toccer);
  }

  testLineFtoc(line) {
    line = line.trim();
    if(this.lang_ftoc === null) {return false};
    let re = new RegExp(this.lang_ftoc);
    if(re.test(line)) {
      return true;
    } else {
      return false;
    }
  }

  testLineRegex(line) {
    line = line.trim();
    if(this.lang_regex === null) {return false};

    for (lrex of this.lang_regex) {
      let re = new RegExp(lrex.pattern);
      if(re.test(line)) {
        return true;
      }
    }
    return false;
  }

  createTocModal(tocList){
    let tocContainer = document.createElement('div');
    tocContainer.classList.add('atom-file-toc-container');

    let tocHeader = document.createElement('div');
    tocHeader.name = 'toc-header';
    tocHeader.style.display = 'flex';
    tocHeader.innerHTML = `
      <div>
        <h3 name="gutter-book-icon"><i class="icon icon-book"></i></h3>
      </div>
      <div>
        <h3>Table of Contents</h3>
      </div>
    `;

    tocContainer.appendChild(tocHeader);

    // Create toc body element
    let tocBody = document.createElement('div');
    tocBody.name = 'toc-body';
    tocBody.style.display = 'flex';

    // Add the line number gutter to the toc container
    let tocGutter = document.createElement('div')
    tocGutter.name = 'toc-gutter';
    tocGutter.classList.add('atom-file-toc-gutter')


    // Create root element
    let tocContent = document.createElement('div');
    tocContent.name = 'toc-content';
    tocContent.classList.add('atom-file-toc-content');

    tocList.forEach(function(item,index) {

      let tocItemGutter = document.createElement('div');
      tocItemGutter.classList.add('atom-file-toc-gutter-item');
      tocItemGutter.innerHTML = `
        <div class="line-number">${item[0]}</div>
      `;
      if(item[4] === true) { tocItemGutter.style.fontWeight = 'bold'; };
      tocGutter.appendChild(tocItemGutter);

      let tocItem = document.createElement('div');
      tocItem.classList.add(item[2]);
      tocItem.classList.add('atom-file-toc-item');
      item[1].replace(' ','&nbsp;');
      tocItem.innerHTML = `
        <span style="white-space:pre;">${item[3]}${item[1]}</span>
      `
      tocItem.dataset.linerow = item[0];
      if(item[4] === true) { tocItem.style.fontWeight = 'bold'; };

      tocContent.appendChild(tocItem);

      tocItem.onclick = (function() {
        this.emitter.emit('toc-goto-line',item[0]);
      }).bind(this);


    }, this);

    tocBody.appendChild(tocGutter);
    tocBody.appendChild(tocContent);
    tocContainer.appendChild(tocBody);

    return tocContainer;

  }

  gotoTocResult(lineCount) {
    /* Center the selected TOC element on the screen */
    let activeEditor = atom.workspace.getActiveTextEditor();
    let options = new Object();
    options.center = true
    activeEditor.scrollToScreenPosition([lineCount,0], options);
    //activeEditor.setCursorScreenPosition([lineCount,0]);

  }

}
