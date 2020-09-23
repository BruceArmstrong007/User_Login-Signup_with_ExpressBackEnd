const n =  new Date();
n.setFullYear(n.getFullYear() - 18);
y = n.getFullYear();
m = getzero(n.getMonth() + 1);
d = getzero(n.getDate());
function getzero(a){
if (a.toString().length <= 1) return "0"+ a;
else return a;
}
const bdate =   y + "-" + m + "-" + d;
document.getElementById("dat").defaultValue = bdate;
document.getElementById("dat").max = bdate;

function validateKeyStrokes(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return true;
    }
    return false;
}
