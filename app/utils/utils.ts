export async function send(route: string, formData: URLSearchParams) {
    try {
        const response = await fetch(`/newRoom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error('There was an error!', error);
        return undefined;
    }
}