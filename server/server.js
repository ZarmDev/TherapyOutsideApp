var groups = {};
const testing = true;

/**
 * Groups should look like:
 */
if (testing) {
    groups = {
        "Soccer group": {
            "chat": [
                ["randuser1", "Whats up soccer chat?"],
                ["randuser2", "Hi!"]
            ],
            "currentevents": [
                {
                    "date": "1722211200000",
                    "title": "Soccer meetup",
                    "description": "Come with us to play soccer!",
                    "location": {
                        "latitude": 40.7480852,
                        "longitude": -73.9884276
                    },
                    "participants": 0,
                    "owner": "soccerkid125"
                },
                {
                    "date": "1722211200000",
                    "title": "Soccer meetup2",
                    "description": "Come with us to play soccer!",
                    "location": {
                        "latitude": 40.7480852,
                        "longitude": -73.9884276
                    },
                    "participants": 0,
                    "owner": "soccerkid125"
                }
            ],
            "pastevents": [
                {
                    "date": "1722211200000",
                    "title": "Soccer meetup",
                    "description": "Come with us to play soccer!",
                    "location": {
                        "latitude": 40.8825153,
                        "longitude": -74.108767
                    },
                    "participants": 0,
                    "owner": "soccerkid125"
                }
            ]
        },
    }
}

const defaultGroupData = {
    "chat": [],
    "currentevents": [],
    "pastevents": []
}

// If this were a real site, ideally we would need rate-limiting as well...
const users = {
    "soccerkid125": {"password": "pass123"}
};

// THERE IS CURRENTLY NO CHECK FOR IF A USER IS IMPERSONATING ANOTHER USER. ADD LATER OR IGNORE.
const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const path = new URL(req.url).pathname;
        const data = await req.formData();

        console.log(path + " was called.");

        if (path == '/createEvent') {
            var events = groups[data.get('groupName')]["currentevents"];
            events.push({
                "date": Date.now(),
                "title": data.get("title"),
                "description": data.get("description"),
                "location": JSON.parse(data.get("location")),
                "participants": 0,
                "owner": data.get('username')
            })
            groups[data.get('groupName')]["currentevents"] = events;
            return new Response("Success");
        } else if (path == '/createGroup') {
            if (groups[data.get("groupName")] == undefined) {
                groups[data.get("groupName")] = defaultGroupData;
            }
            return new Response("Group already exists!");
            // This should be the only route for getting data because it means that all data parsing will be on the client
        } else if (path == '/getGroups') {
            return new Response(JSON.stringify(groups));
        } else if (path == '/joinEvent') {
            var events = groups[data.get('groupName')]["currentevents"];
            var newData = events[data.get('idx')];
            newData["participants"] = String(Number(newData["participants"]) + 1);
            events[data.get('idx')] = newData;
            return new Response(JSON.stringify(groups));
        } else if (path == '/addMessage') {
            var chat = groups[data.get('groupName')]["chat"];
            chat.push([])
            groups[data.get('groupName')]["currentevents"] = events;
        } else if (path == '/createAccount') {
            console.log(Object.keys(users).includes(data.get("username")));
            if (Object.keys(users).includes(data.get("username"))) {
                return new Response("User already exists.", {status: 400});
            }
            users[data.get('username')] = {};
            users[data.get('username')]["password"] = data.get('password');
            return new Response("Success!", {status: 201});
        } else if (path == '/sendMessage') {
            var chatData = groups[data.get('groupName')]["chat"];
            chatData.push([data.get("username"), data.get("content")])
            return new Response("Success!", {status: 200});
        }
    },
});

console.log(`Listening on ${server.url}`);