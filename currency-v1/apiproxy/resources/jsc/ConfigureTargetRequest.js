//context.setVariable('target.copy.pathsuffix', false);
var targetUrl = "http://data.fixer.io/api/";
if(context.getVariable("request.queryparam.date") === null){
    targetUrl = targetUrl + "latest";
}else{
    targetUrl = targetUrl + context.getVariable("request.queryparam.date");
}
context.setVariable("target.url", targetUrl);