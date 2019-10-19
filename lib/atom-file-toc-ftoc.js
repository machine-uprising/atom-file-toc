/*
'python':[
  {
    'example':'#ftoc-1',
    'pattern':'^[#]\\bftoc-\\b\\d*\\s*.*',
    'multiline':false
  }
],
'javascript':[
  {
    'example':'function functionName(params) {',
    'pattern':'^[\\\\]{2}\\bftoc-\\b\\d*\\s*.*',
    'multiline':false
  }
]
*/
ftoc_patterns = {
  'python':'^[#]\\bftoc-\\b\\d*\\s*.*',
  'javascript':'^[/]{2}\\bftoc-\\b\\d*\\s*.*'
}


module.exports = ftoc_patterns;
