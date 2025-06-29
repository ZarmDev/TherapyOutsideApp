import { apiKey, server } from "@/constants/environmentvars";
import * as FileSystem from 'expo-file-system';


export async function send(route: string, formData: URLSearchParams): Promise<Response | undefined> {
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

        if (!response.ok) {
            // throw new Error('Network response was not ok');
            console.log("Network response NOT OK");
        }

        return response;
    } catch (error) {
        console.error('There was an error!', error);
        return undefined;
    }
}

// Usage of AI and https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
export async function fetchNearbyPlaces(latitude: number, longitude: number, textInput: string) {
    const url = `https://places.googleapis.com/v1/places:autocomplete`;

    const body = {
        input: textInput,
        locationBias: {
            circle: {
                center: {
                    latitude,
                    longitude,
                },
                radius: 5000.0, // meters
            },
        },
        // includedPrimaryTypes: ["park"], // optional: bias toward parks
    };

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // don't show error even if apiKey is null
            "X-Goog-Api-Key": apiKey!,
            "X-Goog-FieldMask": "*", // or specify fields like 'places.displayName,places.location'
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        console.error("Failed to fetch places:", await response.text());
        return [];
    }

    const data = await response.json();
    return data;
};

// Usage of AI
export async function fetchPlaceDetails(placeId: string) {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${apiKey}`;
    console.log(url);
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        console.error("Failed to fetch place details:", await response.text());
        return null;
    }

    const data = await response.json();
    return data.location; // { latitude: number, longitude: number }
};

export const writeToDocumentDirectory = async (fileName: string, content: string) => {
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, content);
    console.log('File written successfully');
};

export async function readInDocumentDirectory(fileName: string) : Promise<string | null> {
    const fileUri = FileSystem.documentDirectory + fileName;
    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        console.log('File content:', content);
        return content;
    } catch (error: any) {
        console.log('Failed to read file:', error.message);
        return null;
    }
};

export const appendIfDoesntExistInDocumentDirectory = async (fileName: string, data : string) => {
    const prevData = await readInDocumentDirectory(fileName);
    if (prevData == null) {
        writeToDocumentDirectory(fileName, data);
    } else {
        // If already exists, don't write
        if (prevData?.includes(data)) {
            return;
        }
        writeToDocumentDirectory(fileName, prevData + '\n' + data);
    }
};

export async function doesFileExist(uri: string) {
    const result = await FileSystem.getInfoAsync(uri);
    return result.exists && !result.isDirectory;
}

export async function listDirectoryContents() {
    try {
        const contents = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'quizzes');
        console.log('Directory contents:', contents);
        return contents;
    } catch (error) {
        console.log('Error reading directory:', error);
    }
}

export function deleteFile(item: string) {
    FileSystem.deleteAsync(FileSystem.documentDirectory + "/" + item)
}


// const fetchPlaceDetails = async (latitude: number, longitude: number, textInput: string) => {
//     const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName&key=API_KEY`;

//     const body = {
//         input: textInput,
//         locationBias: {
//             circle: {
//                 center: {
//                     latitude,
//                     longitude,
//                 },
//                 radius: 5000.0, // meters
//             },
//         },
//         // includedPrimaryTypes: ["park"], // optional: bias toward parks
//     };

//     const response = await fetch(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             // don't show error even if apiKey is null
//             "X-Goog-Api-Key": apiKey!,
//             "X-Goog-FieldMask": "*", // or specify fields like 'places.displayName,places.location'
//         },
//         body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//         console.error("Failed to fetch places:", await response.text());
//         return [];
//     }

//     const data = await response.json();
//     return data;
// };