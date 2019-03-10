'use babel';

import AtomFileTocView from './atom-file-toc-view';
import { CompositeDisposable, Disposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {

    // Events subscribed to in atom's system can be easily cleaned up with a
    // CompositeDisposable
    this.subscriptions = new CompositeDisposable(
      //Add an opener for the atom-file-toc
      atom.workspace.addOpener(uri => {
        if(uri === 'atom://atom-file-toc') {
          return new AtomFileTocView;
        }
      })
    );

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-file-toc:toggle': () => this.toggle()
    }));

    new Disposable(() => {
      atom.workspace.getPaneItems().forEach(item => {
        if(item instanceof AtomFileTocView) {
          item.destroy();
        }
      });
    })
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  //serialize() {
  //  return {
  //    AtomFileTocViewState: this.AtomFileTocView.serialize()
  //  };
  //},
  deserializeAtomFileTocView(serialized) {
    return new AtomFileTocView();
  },

  toggle(){
    atom.workspace.toggle('atom://atom-file-toc');
  }

};
