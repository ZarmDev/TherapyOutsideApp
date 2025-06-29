const groups = {};

/**
 * Groups should look like:
    {
        "Soccer group": {
            "chat": {
                "logs": 
                    [
                        ["randuser1", "Whats up soccer chat?"],
                        ["randuser2", "Hi!"]
                    ]
                },
                "currentevents": [
                    {
                        "date": "1722211200000" (Date.now format),
                        "title": "Soccer meetup",
                        "description": "Come with us to play soccer!"
                    }
                ],
                "pastevents": [
                    {
                        {
                            "date": "1722211200000" (Date.now format),
                            "title": "Soccer meetup",
                            "description": "Come with us to play soccer!"
                        }
                    }
                ]
        }
    }
 */

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        const path = new URL(req.url).pathname;
        const data = await req.formData();

        console.log(path + " was called.");

        if (path == '/createEvent') {
            const eventName = data.get("eventName");
            events[eventName];
            return new Response("Success");
        } else if (path == '/createGroup') {
            console.log(data.get('groupName'))
            if (groups[data.get("groupName")] == undefined) {
                groups[data.get("groupName")] = {};
            }
            return new Response("Group already exists!");
        } else if (path == '/getGroups') {
            return new Response(JSON.stringify(groups));
        }
        //  else if (path == '/getUser') {
        //     const username = data.get("username");
        //     return new Response(JSON.stringify(rooms[serverName][1][username]));
        // } else if (path == '/modifyUser') {
        //     const username = data.get("username");
        //     const newData = data.get("newData");
        //     rooms[serverName][1][username] = newData;
        //     return new Response("Success");
        // } else if (path == '/newRoom') {
        //     const serverName = data.get("serverName");
        //     rooms[serverName] = [[], {}];
        //     return new Response("Success");
        // } else if (path == '/getRooms') {
        //     // console.log('getrooms:', JSON.stringify(Object.keys(rooms)))
        //     return new Response(JSON.stringify(Object.keys(rooms)));
        // } else if (path == '/getQuestions') {
        //     const serverName = data.get("serverName");
        //     return new Response(JSON.stringify(rooms[serverName][0]));
        // } else if (path == '/modifyQuestions') {
        //     const serverName = data.get("serverName");
        //     const newQuestions = data.get("newQuestions");
        //     rooms[serverName][0] = newQuestions;
        //     return new Response("Success");
        // } else if (path == '/getAllUsers') {
        //     // console.log(rooms);
        //     return new Response(JSON.stringify(rooms[serverName][1]));
        // }
    },
});

console.log(`Listening on ${server.url}`);