# atom-file-toc package
## Table of Content manager

Atom File Table of Contents builds a table of contents index for the file you are working on.

It can identify class objects and functions in your code and display then in a index making it easy to navigate
through your file.

You can also add bookmarks in your file for references to particular sections of
code that you want to find quickly and easily.

## Working languages
1. Python
2. Javascript, jQuery


### Adding bookmarks to your files
Using the "ftoc-" sequence along with the inline comment style of the language of your
file you can add bookmarks to your file.

#### Adding a Level 1 bookmark
In Python:
/#ftoc-1 This is a Python bookmark

In Javascript
//ftoc-1 This is a Javascript Bookmark


## Example of atom-file-toc

![atom-file-toc example](https://github.com/machine-uprising/atom-file-toc/blob/master/img/atom_file_toc_example.PNG)


## Loading atom-file-toc package in Development
1. Check apm is installed on your system by running
   ```
   apm --version
   ```
2. Navigate to the root directory of the package.

3. Create a symlink from the package directory. This will create the symlink in
   the .atom/packages directory
   The .atom/packages directory -> <current_user>/.atom/packages/
   ```
   apm link
   ```
4. If Atom is already open you need to close and reopen for the package to be
   loading into the Packages menu.


## Stay Tuned. More updates to come!
![Still don't have a screenshot of the package in action](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)
