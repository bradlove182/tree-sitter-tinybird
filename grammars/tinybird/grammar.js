module.exports = grammar({
  name: 'tinybird',

  extras: $ => [
    /\n/
  ],

  conflicts: $ => [
    [$.instruction, $.instruction_content]
  ],

  rules: {
    source_file: $ => repeat(
      choice(
        $.comment,
        $.instruction,
        $.indented_block,
        $._line
      )
    ),

    comment: $ => seq(
      '#',
      /[^\n]*/
    ),

    instruction: $ => seq(
      $.instruction_keyword,
      repeat(/[ \t]/),
      optional($.instruction_content)
    ),

    instruction_keyword: $ => token(prec(1, choice(
      // Datasource keywords
      'SCHEMA',
      'ENGINE',
      'ENGINE_SORTING_KEY',
      'ENGINE_PARTITION_KEY',
      'ENGINE_TTL',
      'ENGINE_VER',
      'ENGINE_SIGN',
      'ENGINE_VERSION',
      'ENGINE_SETTINGS',
      'FORWARD_QUERY',
      'BACKFILL',
      'TOKEN',
      'SHARED_WITH',
      // Pipe keywords
      'DESCRIPTION',
      'TAGS',
      'NODE',
      'SQL',
      'TYPE',
      'DATASOURCE',
      'TARGET_DATASOURCE',
      'COPY_SCHEDULE',
      'COPY_MODE',
      'DEPLOYMENT_METHOD'
    ))),

    instruction_content: $ => repeat1(
      choice(
        $.string,
        $.backtick_identifier,
        $.data_type,
        $.pipe_type,
        $.engine_type,
        $.permission,
        $.sql_keyword,
        $.sql_function,
        $.number,
        $.arrow,
        $.operator,
        $.identifier,
        /[ \t]/,
        /[,()]/,
        /[^\n]/
      )
    ),

    // Indented block for schema definitions and SQL
    indented_block: $ => prec(1, seq(
      /[ \t]+/,
      repeat(
        choice(
          $.backtick_identifier,
          $.data_type,
          $.string,
          $.sql_keyword,
          $.sql_function,
          $.number,
          $.identifier,
          /[ \t]/,
          /[,()]/,
          token(prec(-1, /[^`"'\n\s,()a-zA-Z0-9]+/))
        )
      )
    )),

    data_type: $ => token(choice(
      'AggregateFunction',
      'FixedString',
      'LowCardinality',
      'DateTime',
      'DateTime64',
      'String',
      'Int8', 'Int16', 'Int32', 'Int64',
      'UInt8', 'UInt16', 'UInt32', 'UInt64',
      'Float32', 'Float64',
      'Date',
      'Nullable',
      'Array',
      'Map',
      'Tuple',
      'Enum8',
      'Enum16',
      'UUID'
    )),

    pipe_type: $ => token(choice(
      'ENDPOINT',
      'MATERIALIZED',
      'COPY',
      'SINK'
    )),

    engine_type: $ => token(choice(
      'MergeTree',
      'ReplacingMergeTree',
      'CollapsingMergeTree',
      'VersionedCollapsingMergeTree'
    )),

    permission: $ => token(choice(
      'READ',
      'APPEND'
    )),

    sql_keyword: $ => token(choice(
      'SELECT', 'FROM', 'WHERE', 'GROUP', 'ORDER',
      'LIMIT', 'OFFSET', 'JOIN', 'LEFT', 'RIGHT', 'INNER',
      'ON', 'AND', 'OR', 'NOT', 'IN', 'AS', 'BETWEEN',
      'LIKE', 'IS', 'NULL', 'DISTINCT', 'HAVING', 'UNION',
      'ALTER', 'TABLE', 'MODIFY', 'QUERY', 'BY'
    )),

    sql_function: $ => token(choice(
      // Date/Time functions
      'toYYYYMM', 'toStartOfDay', 'toStartOfHour', 'toStartOfMonth',
      'toIntervalDay', 'toIntervalHour', 'toIntervalMonth',
      'now', 'today', 'yesterday',
      // Aggregate functions
      'sum', 'count', 'avg', 'min', 'max', 'uniq', 'groupArray',
      // State functions
      'anyState', 'minState', 'maxState', 'countState', 'sumState', 'avgState'
    )),

    string: $ => token(choice(
      seq('"', /[^"]*/, '"'),
      seq("'", /[^']*/, "'")
    )),

    backtick_identifier: $ => token(seq(
      '`',
      /[^`]*/,
      '`'
    )),

    number: $ => /\d+(\.\d+)?/,

    arrow: $ => '>',

    operator: $ => token(choice(
      '=', '>=', '<=', '!=', '<>',
      '+', '-', '*', '/', '%'
    )),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Only match non-indented lines
    _line: $ => token(prec(-2, /[^\n# \t][^\n]*/))
  }
});
