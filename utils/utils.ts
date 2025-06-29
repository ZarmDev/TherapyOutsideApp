import { server } from "@/constants/environmentvars";

export async function send(route: string, formData: URLSearchParams) {
    try {
        const url = `${server}${route}`;
        console.log(url);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        console.log(response);

        if (!response.ok) {
            // throw new Error('Network response was not ok');
            console.log("Network response NOT OK");
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error('There was an error!', error);
        return undefined;
    }
}