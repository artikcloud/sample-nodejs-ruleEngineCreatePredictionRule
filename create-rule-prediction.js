var request = require("request");

var your_user_id = 'your_user_id_here';
var your_user_token = 'your_user_token_here';
var your_device_id = 'your_device_id_here';

var url = 'https://api.artik.cloud/v1.1/rules?userId' + your_user_id;



// Here let's prepare the rule that will be created into your account.
// name	   - name of this rule which will be shown in user dashboard
// description - description of the rule
// rule    - the `if` and `then` condition
// enabled - we will create and have this rule enabled
// scope   - can be value of 'thisApplication' or 'allApplications' 
//    'thisApplication' (rule is accessible only to this application)
//    'allApplications' (rule is accessible to all applications)  

var rule_body = {
	"name": "Sample Prediction Rule",
	"description": "sample prediction rule",
	"rule": {"if":{}, "then":{}},
	"enabled": true,
	"scope": "thisApplication"
}

// The if condition here will trigger if there is an anomaly detection
// sdid 	-  the device_id that will be monitored for anomaly
// field	-  monitors the `state` field of your device
// operator -  using "=" here to trigger if anomaly is detected
// transformer - will be defined as 'prediction' | or 'anomaly'.  Here we use prediction.
// parameters.predictIn - time (seconds) to evaluate the future predicted value 

rule_body.rule.if = {
	"sdid": your_device_id,
	"field": "state",
	"operator": "=",
	"operand": {"value": true},
	"transformer": {
	    "type": "prediction",
        "parameters": { 
          "predictIn": 3600
         }
    }
}

// the action that is called when a anomaly is detected
// ddid     	- device_id to perform the action
// action   	- the action to call on the device
// parameters 	- any parameters if the action requires any parameters

rule_body.rule.then = [{
	"ddid":your_device_id,
	"action":"setOn",
	"parameters":{}}
];


var options = { 
  method: 'POST',
  url: url,
  headers: 
   { 'Authorization': 'Bearer ' + your_user_token,
     'Content-Type': 'application/json' },
  body: rule_body,
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(JSON.stringify(body));
  
  // response example:
  //{"data":{"uid":"ccccc12345...","id":"e66a725e0cbe424b80e26bd1623402f1","aid":"aaaaa12345...","name":"Sample Prediction Rule","languageVersion":1,"rule":{"if":{"sdid":"95c2fb05044749b7bf1966be7e0c6237","field":"state","operator":"=","operand":{"value":true},"transformer":{"type":"prediction","parameters":{"predictIn":10}}},"then":[{"ddid":"95c2fb05044749b7bf1966be7e0c6237","action":"setOn","parameters":{}}]},"enabled":true,"index":1,"createdOn":1524777757346,"modifiedOn":1524777757346,"isTestable":true,"scope":"thisApplication","description":"sample prediction rule","warning":{"code":6316,"message":"Transformer warnings","warnings":[[{"modelId":"a147749a73f94c5688e9e67e0f66f16f","messages":["is training"]}]]}}}

});

