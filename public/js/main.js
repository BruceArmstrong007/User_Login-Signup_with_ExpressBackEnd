document.getElementById('Vdiv').style.display = 'none';

function show(mail,opt){
    const valu = {email: mail,reg:opt,_csrf:document.getElementById('csrf').value}; 
    if(mail !=""){
    fetch('http://localhost:3000/accounts/verify',{
        credentials: 'include',
        method : 'POST',     
     headers:{
         'Content-type':'application/json',
             },
     body: JSON.stringify(valu), 
    }).then(res => { 
    return res.json();
    }).then(data => {
        console.log(data.result);
        alert(data.result);
    });
}
}