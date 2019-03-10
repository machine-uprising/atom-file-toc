'use babel';

import { Emitter } from 'atom';

export default class AtomFileTocView {
  modalElement: null;

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
      fileGrammar = item.getGrammar();
      this.modalElement.innerHTML = `
        <h2>${item.getFileName() || 'untitled'}</h2>
        <ul>
          <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
          <li><b>Tab Length:</b> ${item.getTabLength()}</li>
          <li><b>Encoding:</b> ${item.getEncoding()}</li>
          <li><b>Line Count:</b> ${item.getLineCount()}</li>
          <li><b>Language:</b> ${fileGrammar.name}</li>
        </ul>
      `;

      filetoc = this.addViewText(item);
      this.modalElement.appendChild(filetoc);
    })

    this.emitter.on('toc-goto-line',(val) => {
      this.gotoTocResult(val);
    });
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

  addViewText(item) {
    let toccer = Object.assign([]);

    for(let i=0;i<=item.getScreenLineCount();i++) {
      line = item.lineTextForScreenRow(i);
      if(typeof(line) === 'undefined') { continue }

      if (line.trim().substring(0,5) == 'class'){
        toccer.push([i,line]);
      } else if(line.trim().substring(0,3) == 'def'){
        toccer.push([i,line]);
      };
    };
    return this.tocModal(toccer);
  }

  tocModal(tocList){
    // Create root element
    let tocContent = document.createElement('div')
    tocContent.classList.add('atom-file-toc-content');

    // Create header element
    let tocHeader = document.createElement('div');
    tocHeader.textContent = 'Table of Contents';
    tocContent.appendChild(tocHeader);


    // Create toc element
    tocList.forEach(function(item,index) {
      let tocItem = document.createElement('div');
      tocItem.classList.add('atom-file-toc-item');
      item[1].replace(' ','&nbsp;');
      tocItem.innerHTML = `
        <span style="white-space:pre;">${item[1]}</span>
      `
      tocItem.dataset.linerow = item[0];
      tocContent.appendChild(tocItem);
      tocItem.onclick = (function() {
        this.emitter.emit('toc-goto-line',item[0]);
      }).bind(this)

    }, this);

    return tocContent;

  }

  gotoTocResult(lineCount) {
    /*
      Center the selected TOC element on the screen
    */
    let activeEditor = atom.workspace.getActiveTextEditor();
    let options = new Object();
    options.center = true
    activeEditor.scrollToScreenPosition([lineCount,0], options);
    //activeEditor.setCursorScreenPosition([lineCount,0]);

  }

}
