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

function createLinkElement(text_and_link) {
    const item = document.createElement("a");
    item.textContent = text_and_link;
    item.href = text_and_link;
    return item;
}

const guildId = getUrlParamIgnoreCase("id");

const onError = function(data) {
    const defaultErrorMsg = "An error occurred. Please check if '" + guildId + "' is the correct id.";
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
            } else if (json.code !== 10004) { //10004 == Unknown Guild
                //guild id is probably fine && error is probably Widget Disabled:
                const text2 = document.createElement("div");
                text2.textContent = "Maybe try one of these links (only when you think the guild maybe listed there):";

                const links = ["https://discordservers.me/servers/", "https://disboard.org/server/", "https://top.gg/servers/"];
                const list = document.createElement("ul");

                let i;
                for (i = 0; i < links.length; i++) {
                    const item = document.createElement("li");
                    item.appendChild(createLinkElement(links[i] + guildId));
                    list.appendChild(item);
                }

                text2.append(list);
                text.append(text2);

                const footer = document.createElement("footer");
                footer.textContent = "Disclaimer: This page isn't affiliated with any of the websites listed above. I just chose them, because they were the only " + links.length
                    + " I could find, that used the guild ids in their url. If you think that one service is missing tell me on GitHub."
                text.append(footer);
            }
        } catch (e) { //when data not json:
            message = data;
        }
        text.prepend(defaultErrorMsg + " Message: '" + message + "'");
    } else {
        text.append(defaultErrorMsg);
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

            new_element.append(createLinkElement(invite));
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