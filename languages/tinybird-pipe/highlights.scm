; Comments
(comment) @comment

; Tinybird keywords
(instruction_keyword) @keyword

; Indented block content (schema definitions, SQL)
(indented_block
  (data_type) @type.builtin)

(indented_block
  (sql_keyword) @keyword)

(indented_block
  (sql_function) @function.builtin)

(indented_block
  (string) @string)

(indented_block
  (backtick_identifier) @variable.special)

(indented_block
  (number) @number)

(indented_block
  (identifier) @variable)

; Data types
(data_type) @type.builtin

; Pipe types
(pipe_type) @type.builtin

; Engine types
(engine_type) @type.builtin

; Permissions
(permission) @constant.builtin

; SQL keywords
(sql_keyword) @keyword

; SQL functions
(sql_function) @function.builtin

; Strings
(string) @string

; Backtick identifiers
(backtick_identifier) @variable.special

; Numbers
(number) @number

; Arrow
(arrow) @operator

; Operators
(operator) @operator

; Identifiers
(identifier) @variable
