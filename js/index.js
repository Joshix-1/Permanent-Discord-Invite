const widget = "https://discordapp.com/api/guilds/GUILD_ID/widget.json";
const text = document.getElementsByClassName("text").item(0);
text.textContent = "";

function getUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter) {
    if (window.location.href.indexOf(parameter + "=") > -1) {
        return getUrlVars()[parameter];
    } else {
        return "";
    }
}

const onError = function(data) {
    let str = "";
    if(data !== "") {
        try {
            let json = JSON.parse(data);
            let message = json.message;
            if(typeof message === "undefined") {
                message = json["guild_id"][0];
                if(typeof message === "undefined") {
                    str = 'Message = "' + message + '"';
                } else {
                    str = 'Message = "' + data + '"';
                }
            } else {
                str = 'Message = "' + message + '"';
            }
        } catch(ignored){}

    }
    text.append("An error occurred. " + str);
};


const openInvite = function (data) {
    const invite = JSON.parse(data)["instant_invite"];
    if(typeof invite === "undefined") {
        onError(data);
    } else {
        let new_element = document.createElement("div");
        new_element.textContent = "Click here if the forwarding doesn't work: ";
        let hyper_link = document.createElement("a");
        hyper_link.textContent = invite;
        hyper_link.href = invite;
        new_element.append(hyper_link);
        text.append(new_element);
        window.location = invite;
    }
};

const id = getUrlParam("id");
if(id === "") {
    window.location = "README.md"
} else {
    fetch(widget.replace("GUILD_ID", id))
        .then(function(response) {
            response.text().then(openInvite);
        }, function (response) {
            response.text().then(onError);
        }

    );
}