exports.emailValidator = async(email)=>{
    const emailRegex = new RegExp(/^[a-zA-Z][a-zA-Z0-9._\-$]*@[a-zA-Z.]+\.[a-zA-Z]{2,3}$/);
    if(email===null||email===undefined||!emailRegex.test(email)){
        throw new Error("Email is Invalid");
    }
}

exports.nameValidator = async(name)=>{
    const nameRegex = new RegExp(/^[A-Za-z ]+[A-Za-z]+$/);
    if(name===null||name===undefined||!nameRegex.test(name)||name.length<3||name.length>50){
        throw new Error("Name is Invalid");
    }
}

exports.screenNameValidator = async(screenName)=>{
    const screenNameRegex = new RegExp(/^[A-Za-z0-9.,'_\-+=@!$%^&*]+$/);
    if(screenName===null||screenName===undefined||!screenNameRegex.test(screenName)||screenName.length<4||screenName.length>50){
        throw new Error("User Name is Invalid");
    }
}