const events = {};

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        await Bun.write("rooms.txt", JSON.stringify(rooms));
        const path = new URL(req.url).pathname;
        const data = await req.formData();
        // get form data
        // const serverName = data.get("serverName");

        if (path == '/createEvent') {
            const eventName = data.get("eventName");
            events[eventName];
            return new Response("Success");
        } else if (path == '/getUser') {
            const username = data.get("username");
            return new Response(JSON.stringify(rooms[serverName][1][username]));
        } else if (path == '/modifyUser') {
            const username = data.get("username");
            const newData = data.get("newData");
            rooms[serverName][1][username] = newData;
            return new Response("Success");
        } else if (path == '/newRoom') {
            const serverName = data.get("serverName");
            rooms[serverName] = [[], {}];
            return new Response("Success");
        } else if (path == '/getRooms') {
            // console.log('getrooms:', JSON.stringify(Object.keys(rooms)))
            return new Response(JSON.stringify(Object.keys(rooms)));
        } else if (path == '/getQuestions') {
            const serverName = data.get("serverName");
            return new Response(JSON.stringify(rooms[serverName][0]));
        } else if (path == '/modifyQuestions') {
            const serverName = data.get("serverName");
            const newQuestions = data.get("newQuestions");
            rooms[serverName][0] = newQuestions;
            return new Response("Success");
        } else if (path == '/getAllUsers') {
            // console.log(rooms);
            return new Response(JSON.stringify(rooms[serverName][1]));
        }
    },
});

setInterval(() => {

})

console.log(`Listening on ${server.url}`);