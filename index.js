var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "api/iml";
var stdDBName = "STD-DB";
var stdRelationName = "StdData";
var connToken = "90932423|-31949269656642637|90955694";

$("#rollNo").focus();

function saveRecno2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);

}

function getEmpIdAsJsonObj(){
    var rollNo = $('#rollNo').val();
    var jsonStr={
        id:empid
    }
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj){
    saveRecno2LS(jsonObj);
    var record = JSON.parse(jsonOBJ.data).record;
    $("#fullName").val(data.empName);
    $("#Class").val(data.empbs);
    $("#birtDate").val(data.emphra);
    $("#Address").val(data.empda);
    $("#enrollmentdate").val(data.empdeduction);
}

function validateAndGetFormData() {
    var rollNoVar = $("#rollNo").val();
    if (rollNoVar === "") {
        alert("Roll No is Required Value");
        $("#rollNo").focus();
        return "";
    }
    var fullNameVar = $("#fullName").val();
    if (fullNameVar === "") {
        alert("Full Name is Required Value");
        $("#fullName").focus();
        return "";
    }
    var ClassVar = $("#Class").val();
    if (ClassVar === "") {
        alert("Class is Required Value");
        $("#Class").focus();
        return "";
    }
    var birtDateVar = $("#birtDate").val();
    if (birthDateVar === "") {
        alert("Birthdate is Required Value");
        $("#birtDate").focus();
        return "";
    }
    var AddressVar = $("#Address").val();
    if (AddressVar === "") {
        alert("Address is Required Value");
        $("#Address").focus();
        return "";
    }
    var enrollmentDateVar = $("#enrollmentDate").val();
    if (enrollmentDateVar === "") {
        alert("Enrollment date is Required Value");
        $("#enrollmentDate").focus();
        return "";
    }
    var jsonStrObj = {
        rollNo: rollNoVar,
        fullName: fullNameVar,
        Class:ClassVar ,
        birthDate:birthDateVar,
        Address:AddressVar,
        enrollmentDate:enrollmentDateVar
    };
    return JSON.stringify(jsonStrObj);
}
// This method is used to create PUT Json request.
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
        + "\"token\" : \""
        + connToken
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"PUT\",\n"
        + "\"rel\" : \""
        + relName + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";
    return putRequest;
}
function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function saveDetails() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest("90937398|-31949270228626032|90955299",
        jsonStr, "STD-DB", "StdData");
    alert(putReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(putReqStr,
        "http://api.login2explore.com:5577", "/api/iml");
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function resetForm() {
    $("#rollNo").val("")
    $("#fullName").val("");
    $("#Class").val("");
    $("#birthDate").val("");
    $("#Address").val("");
    $("#enrollmentDate").val("");
    $("#rollNo").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#rollNo").focus();
}

function changeData(){
    $("#change").prop("disabled",true);
    jsonChg = validateAndGetFormData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName,localStorage.getItem());
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#rollNo").focus();


}

function getEmp(){
    var rollNoJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,stdBName,stdRelationName,rollNoJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status===4000){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#fullName').focus();
    }else if(resJsonObj.status===200){
        $('#rollNo').prop('disabled',true);
        fillData(resJsonObj);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#fullName').focus();

    }
}
