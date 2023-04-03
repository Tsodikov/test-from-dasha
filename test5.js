const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "definitions": {
      "attendees": {
        "type": "object",
        "$id": "#attendees",
        "properties": {
          "userId": {
            "type": "integer"
          },
          "access": {
            "enum": [
              "view",
              "modify",
              "sign",
              "execute"
            ]
          },
          "formAccess": {
            "enum": [
              "view",
              "execute",
              "execute_view"
            ]
          }
        },
        "required": [
          "userId",
          "access"
        ]
      }
    },
    "type": "object",
    "properties": {
      "id": {
        "anyOf": [
          {
            "type": "string"
          },
          {
            "type": "integer"
          }
        ]
      },
      "title": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "startDate": {
        "type": "integer"
      },
      "endDate": {
        "type": "integer"
      },
      "attendees": {
        "type": "array",
        "items": {
          "$ref": "#attendees"
        },
        "default": []
      },
      "parentId": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "string"
          },
          {
            "type": "integer"
          }
        ]
      },
      "locationId": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "integer"
          }
        ]
      },
      "process": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "string",
            "format": "regex",
            "pattern": "https:\\/\\/[a-z]+\\.corezoid\\.com\\/api\\/1\\/json\\/public\\/[0-9]+\\/[0-9a-zA-Z]+"
          }
        ]
      },
      "readOnly": {
        "type": "boolean"
      },
      "priorProbability": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
          }
        ]
      },
      "channelId": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "integer"
          }
        ]
      },
      "externalId": {
        "anyOf": [
          {
            "type": "null"
          },
          {
            "type": "string"
          }
        ]
      },
      "tags": {
        "type": "array"
      },
      "form": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "viewModel": {
            "type": "object"
          }
        },
        "required": [
          "id"
        ]
      },
      "formValue": {
        "type": "object"
      }
    },
    "required": [
      "id",
      "title",
      "description",
      "startDate",
      "endDate",
      "attendees"
    ]
}


function generateDataFromSchema(schema, options = {}) {
  const { maxArrayLength = 5, maxNumberValue = 100 } = options;

  function generateRandomString() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const alphanumeric = letters + numbers;
    let result = 'https://';
    for (let i = 0; i < 10; i++) {
        result += letters[Math.floor(Math.random() * letters.length)];
    }
    result += '.corezoid.com/api/1/json/public/';
    for (let i = 0; i < 3; i++) {
        result += numbers[Math.floor(Math.random() * numbers.length)];
    }
    result += '/';
    for (let i = 0; i < 10; i++) {
        result += alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
    }
    return result;
}

  function generateRandomValueFromSchema(schema) {
    if (schema.hasOwnProperty('type')) {
        if (schema.type === 'integer') {
            return Math.floor(Math.random() * maxNumberValue);
          } else if (schema.type === 'number') {
            return Math.random() * maxNumberValue;
          } else if (schema.type === 'string') {
            if (schema.hasOwnProperty('format') && schema.format === 'regex') {
                return generateRandomString();
            } else {
                return Math.random().toString(36).substring(2);
            }
          } else if (schema.type === 'boolean') {
            return Math.random() < 0.5;
          } else if (schema.type === 'null') {
            return null;
          } else if (schema.type === 'array') {
            const items = [];
            for (let i = 0; i < Math.floor(Math.random() * maxArrayLength); i++) {
                if (schema.hasOwnProperty('items')) {
                    items.push(generateRandomValueFromSchema(schema.items));
                } else {
                    items.push(null);
                }
            }
            return items;
          } else if (schema.type === 'object') {
            const obj = {};
            for (const key in schema.properties) {
              obj[key] = generateRandomValueFromSchema(schema.properties[key]);
            }
            return obj;
        }
    }
     else if (schema.enum) {
      return schema.enum[Math.floor(Math.random() * schema.enum.length)];
    } else if (schema.anyOf) {
      return generateRandomValueFromSchema(schema.anyOf[Math.floor(Math.random() * schema.anyOf.length)]);
    }
  }

  return generateRandomValueFromSchema(schema);
}

console.log(generateDataFromSchema(schema, { maxArrayLength: 10, maxNumberValue: 1000 }));
