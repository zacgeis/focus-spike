**Spike Code**

This is just a quick spike to explore programmatically running single Jasmine tests using line number for selection.

**Usage**

Basic:
```
npm install
node focus.js test.js 4
```

Along with a simple VIM script, you can quickly focus specific tests in VIM.
```vimscript
let args = ['node', 'focus.js', expand("%"), line(".")]
call system(join(args, ' '))
bufdo e
```

**Implementation**

This approach uses Esprima to parse the JS file.  Once the parser has constructed an AST, a search is done over the AST for
relevant callees; in this case 'it' and 'iit'.  The Esprima nodes have an optional location property which include both a
line and column.  Using the list of relevant callees along with their location information, a transformation plan is created
for the original document (somewhat similar to OTs).  This is done to preserve the original formatting of the document, as
opposed to having the AST translated back to source generatively.
