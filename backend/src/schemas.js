const Ajv = require('ajv');
const ajv = new Ajv();

const intArray = {
    type: 'array',
    uniqueItems: true,
    items: {type: 'integer'}
};

const problemData = {
    author: {type: 'integer'},
    title: {type: 'string'},
    statement: {type: 'string'},
    solution: {type: 'string'},
    problemTags: intArray,
    contestTags: intArray
};

const problemRequirements = ['author', 'title', 'statement', 'solution', 'problemTags', 'contestTags'];

exports.problemCreate = ajv.compile({
    type: 'object',
    properties: problemData,
    required: problemRequirements,
    additionalProperties: false
});

exports.problemAlter = ajv.compile({
    type: 'object',
    properties: {
        ...problemData,
        id: {type: "integer"}
    },
    required: [...problemRequirements, 'id'],
    additionalProperties: false
});