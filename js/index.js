const widget = "https://discordapp.com/api/guilds/ID/widget.json";
const text = document.getElementById("text");
text.textContent = ""; //remove javascript disabled text


function isUndefined(val) {
    return typeof val === "undefined";
}
function getUrlVarsLowerCase() {
    const vars = {};
    window.location.href.toLocaleLowerCase().replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParamIgnoreCase(parameter) {
    const val = getUrlVarsLowerCase()[parameter.toLocaleLowerCase()];
    return isUndefined(val) || val === "" ? false : val;
}

const guildId = getUrlParamIgnoreCase("id");

const onError = function(data) {
    text.append("An error occurred. Please check if '" + guildId + "' is correct. ");
    if(data !== "") {
        let message = "";
        try {
            const json = JSON.parse(data);
            message = json.message;
            if (isUndefined(message)) {
                message = json["guild_id"][0];
                if (isUndefined(message)) { //when data unexpected json:
                    message = data;
                }
            }
        } catch (e) { //when data not json:
            message = data;
        }
        text.append("Message: '" + message + "'");
    }
};

const openInvite = function (data) {
    try {
        const invite = JSON.parse(data)["instant_invite"];
        if(isUndefined(invite)) {
            onError(data);
        } else if (invite === null) {
            onError("instant_invite is null")
        } else {
            const new_element = document.createElement("div");
            new_element.textContent = "Click here if the forwarding doesn't work: ";

            const hyper_link = document.createElement("a");
            hyper_link.textContent = invite;
            hyper_link.href = invite;

            new_element.append(hyper_link);
            text.append(new_element);

            window.location = invite;
        }
    } catch(e) { //probably data != json
        onError(e.toString());
    }
};

if(guildId) {
    fetch(widget.replace("ID", guildId))
        .then(function(response) {
            response.text().then(openInvite);
        }, function (error) {
            error.text().then(onError);
        }
    );
} else {
    window.location = "README.md"
}