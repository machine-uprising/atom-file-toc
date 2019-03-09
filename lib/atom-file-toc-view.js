'use babel';
//import EventEmitter from './pytoc-eventemitter';
//const EventEmitter = require('events');

//export default class PytocView extends EventEmitter {
import { Emitter } from 'atom';

export default class AtomFileTocView {
  modalElement: null;
  windowHeight: null;
  closeModal: null;
  closeButton: null;

  constructor(serializedState) {
    this.emitter = new Emitter();
    this.windowHeight = window.innerHeight;
    this.closeModal = false;

    // Create root element
    this.modalElement = document.createElement('div');
    this.modalElement.classList.add('atom-file-toc');
    this.modalElement.style.position = 'relative';
    this.modalElement.style['font-size'] = '12px';

    window.addEventListener('resize',this.getWindowResize);

    this.closeButton = document.createElement('div');
    this.closeButton.textContent = 'Close';
    this.closeButton.classList.add('message');
    this.closeButton.style.position = 'absolute';
    this.closeButton.style.right = '10px';
    this.closeButton.style.top = '0px';
    this.closeButton.style.border = '1px solid white';
    this.closeButton.style["border-radius"] = '4px';

    //var closeButtonFunc = (function() {
    //  this.emitter.emit('closetoc',true);
    //}).bind(this)

    //this.closeButton.onclick = closeButtonFunc
    this.closeButton.onclick = (function() {
      this.emitter.emit('closetoc',true);
    }).bind(this)

  }

  getWindowResize() {
    console.log("getWindowResize");
    console.log(window.innerHeight);
    this.windowHeight = window.innerHeight;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.modalElement.remove();
  }

  getElement() {
    return this.modalElement;
  }

  addViewText(textInfo) {
    // split text based on carriage return and line feeds
    let toccer = Object.assign([]);
    let linesplitter = textInfo.split(/\r?\n/g);
    // remove empty lines from array
    linesplitter = linesplitter.filter(v=>v!='');

    for (line of linesplitter) {
      if (line.trim().substring(0,5) == 'class'){
        toccer.push(line);
      } else if(line.trim().substring(0,3) == 'def'){
        toccer.push(line);
      };
    };

    return this.tocModal(toccer);
  }

  tocModal(tocList){
    // Create root element
    this.modalElement = document.createElement('div');
    this.modalElement.classList.add('pytoc');
    this.modalElement.style.height = '200px';
    this.modalElement.style.overflow = 'auto';
    this.modalElement.draggable = true;

    // Create header element
    let header = document.createElement('div');
    header.textContent = 'Python Clafunk TOC';
    header.classList.add('message');
    this.modalElement.appendChild(header);

    this.modalElement.appendChild(this.closeButton);


    // Create toc element
    tocList.forEach(function(toc,tocix) {
      let message = document.createElement('div');
      message.textContent = toc;
      message.dataset.pytocix = tocix;
      message.classList.add('message');
      this.modalElement.appendChild(message);
      message.onclick = (function() {
        this.emitter.emit('gototoc',toc);
      }).bind(this)

    }, this);

    console.log(this.modalElement);
  }

}
