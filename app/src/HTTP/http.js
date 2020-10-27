
// HTTP toolbox for CRUD operations.
import regeneratorRuntime from "regenerator-runtime";

export class  HTTP {

    static async post(query, token, variables) {
        const response = await fetch(process.env.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'Bearer ' + token
            },
           // body: JSON.stringify(data)
           body: JSON.stringify({
            query: query,
            variables: variables,
          })
        })

        //console.log(JSON.stringify(data))

        const jsonData = await response.json();

        if (response.ok) {
            console.log(jsonData);
            return jsonData;
        } else {
            console.log(jsonData)
            let err = jsonData.errors.reduce((a, n) => a + ' ' + n.message, '');
            throw new Error(err)
        }
    }
}





