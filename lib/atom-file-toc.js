'use babel';

import AtomFileTocView from './atom-file-toc-view';
import { CompositeDisposable } from 'atom';

export default {

  AtomFileTocView: null,
  modalPanel: null,
  subscriptions: null,
  toggleTocModal: false,
  activeEditor: null,

  activate(state) {
    this.AtomFileTocView = new AtomFileTocView(state.AtomFileTocViewState);
    this.emitter = this.AtomFileTocView.emitter;

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-file-toc:toggle': () => this.toggler()
    }));

    this.emitter.on('closetoc',(value) => {
      console.log("CLOSETOC FIRED FINALLY");
      this.toggler();
    });

    this.emitter.on('gototoc',(val) => {
      console.log("GOTOTOC FIRED");
      console.log(val);
      this.gotoTocResult(val);
    });
  },

  deactivate() {
    if(typeof(this.modalPanel) !== 'undefined') {
      this.modalPanel.destroy()
    }
    this.subscriptions.dispose();
    this.AtomFileTocView.destroy();
  },

  //serialize() {
  //  return {
  //    AtomFileTocViewState: this.AtomFileTocView.serialize()
  //  };
  //},

  buildTocModal() {
    console.log('buildTocModal');
    let editor
    if (this.activeEditor = atom.workspace.getActiveTextEditor()) {
      this.activeEditor.emitter.on('did-change',this.changedTextEditor);
      let editorText = this.activeEditor.getText()
      this.AtomFileTocView.addViewText(editorText)
      this.modalPanel = atom.workspace.addModalPanel({
        item: this.AtomFileTocView.getElement(),
        visible: true
      });

      return null;
    } else {
      // Do nothing if current tab is not a text editor
      return;
    }
  },

  changedTextEditor(ev) {
    console.log("Text Edit Value Changed");
  },

  destroyTocModal() {
    this.modalPanel.destroy()
    return null;
  },

  toggler(){
    console.log('Pytoc toggler()');
    this.toggleTocModal = !this.toggleTocModal;
    return (
      this.toggleTocModal ? this.buildTocModal() : this.destroyTocModal()
    );
  },

  gotoTocResult(value) {
    console.log('gotoTocResult');
    console.log(value);
  }

};
