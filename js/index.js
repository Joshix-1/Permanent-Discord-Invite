const widget = "https://discordapp.com/api/guilds/ID/widget.json";
const text = document.getElementById("text");
text.textContent = ""; //remove javascript disabled text

function getUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter) {
    const val = getUrlVars()[parameter];
    return typeof val === "undefined" || val === "" ? false : val;
}

const onError = function(data) {
    text.append("An error occurred. ");
    if(data !== "") {
        let json = JSON.parse(data);
        let message = json.message;
        if(typeof message === "undefined") {
            message = json["guild_id"][0];
            if(typeof message !== "undefined") {
                message =  data;
            }
        }
        text.append("Message: " + message);
    }
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

const guildId = getUrlParam("id");
if(guildId) {
    fetch(widget.replace("ID", guildId))
        .then(function(response) {
            response.text().then(openInvite);
        }, function (response) {
            response.text().then(onError);
        }
    );
} else {
    window.location = "README.md"
}