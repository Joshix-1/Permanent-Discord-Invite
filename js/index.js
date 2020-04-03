const widget = "https://discordapp.com/api/guilds/GUILD_ID/widget.json";
const text = $(".text");
text.text("");

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
    text.append('<div>An error occurred. ' + str + '</div>');
};


const openInvite = function (data) {
    try {
        let invite = JSON.parse(data)["instant_invite"];
        if(invite == undefined) {
            onError(data);
        } else {
            text.append('<div>Click here if you the forwarding doesn\'t work: <a href="' + invite + '">' + invite + '</a></div>');
            window.location = invite;
        }
    } catch(e) {
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