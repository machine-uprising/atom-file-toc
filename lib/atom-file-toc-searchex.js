/*
Python Regex Checks
  class class_name(object):
  def function_name():

  : def function_name(params):
    /^\bdef \b\b\w*\b[(](.*|)[)][:]/
  : class class_name(params):
    /^\bclass \b\b\w*\b[(](.*|)[)][:]/


JavaScript Regex Checks
  : function functionName(params) {
    ^\bfunction\b\s*\b\w*\b\s*[(].*[)].*[{]

  : functionName: function(params) {
    ^\w*\s*[:]\s*\bfunction\b\s*[(].*[)]\s*[{]

  : functionName: (params) {
    ^\w*\s*[:]\s*[(].*[)].*[{]

  : class Dog extends Animal {
    ^\bclass\b\s*\w*.*[{]
*/
regex_patterns = {
  'example':[
    {
      'example':'',
      'pattern':'',
      'multiline':false
    }
  ],
  'python':[
    {
      'example':'def function_name(params):',
      'pattern':'^\\bdef\\b\\s*\\b\\w*\\b[(](.*|)[)][:]',
      'multiline':false
    },
    {
      'example':'def __init__(self,',
      'pattern':'^\\bdef\\b\\s*\\b\\w*\\b[(](.*|)',
      'multiline':false
    },
    {
      'example':'class class_name(params):',
      'pattern':'^\\bclass\\b\\s*\\b\\w*\\b[(](.*|)[)][:]',
      'multiline':false
    }
  ],
  'javascript':[
    {
      'example':'function functionName(params) {',
      'pattern':'^\\bfunction\\b\\s*\\b\\w*\\b\\s*[(].*[)].*[{]',
      'multiline':false
    },
    {
      'example':'functionName: function(params) {',
      'pattern':'^\\w*\\s*[:]\\s*\\bfunction\\b\\s*[(].*[)]\\s*[{]',
      'multiline':false
    },
    {
      'example':'functionName: (params) {',
      'pattern':'^\\w*\\s*[:]\\s*[(].*[)].*[{]',
      'multiline':false
    },
    {
      'example':'class Dog extends Animal {',
      'pattern':'^\\bclass\\b\\s*\\w*.*[{]',
      'multiline':false
    },
    {
      'example':'function(param) {',
      'pattern':'^\\b\\w*\\b\\s*[(].*[)].*[{]',
      'multiline':false
    }
  ]
}


module.exports = regex_patterns;
