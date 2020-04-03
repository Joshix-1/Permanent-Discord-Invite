const widget = "https://discordapp.com/api/guilds/GUILD_ID/widget.json";
const text = document.getElementsByClassName("text").item(0);
text.textContent = "";

function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter) {
    if (window.location.href.indexOf(parameter) > -1) {
        return getUrlVars()[parameter];
    } else {
        return "";
    }
}

const onError = function(data) {
    var str = "";
    if(data !== "") {
        try {
            let json = JSON.parse(data);
            let message = json.message;
            if(message == undefined) {
                message = json["guild_id"][0];
                if(message != undefined) {
                    str = 'Message = "' + message + '"';
                }
            } else {
                str = 'Message = "' + message + '"';
            }
        } catch(ignored){};

    }
    text.append('An error occurred. ' + str);
};


const openInvite = function (data) {
    try {
        let invite = JSON.parse(data)["instant_invite"];
        if(invite == undefined) {
            onError(data);
        } else {
            let new_element = document.createElement("div");
            new_element.textContent = "Click here if the forwarding doesn\'t work: ";
            let hyper_link = document.createElement("a");
            hyper_link.textContent = invite;
            hyper_link.href = invite;
            new_element.append(hyper_link);
            text.append(new_element);
            window.location = invite;
        }
    } catch(e) {
        console.log(e);
        onError(data);
    }
};

let id = getUrlParam("id");
if(id === "") {
    window.open("README.md")
} else {
    fetch(widget.replace("GUILD_ID", id))
        .then(function(response) {
            response.text().then(openInvite);
        }, function (response) {
            response.text().then(onError);
        }

    );
}