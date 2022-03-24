/**
 * 
 * EasyHTTP Library
 * 
 * @version 3.0.0
 * @author Ezeobi Kingsley Sunny
 * @license EKC
 * 
 * 
 */

class EasyHTTP {
    // The GET HTTP Request
    async get(url){
        const response = await fetch(url);
        const data = await response.json();
        return data
    }

    // The POST HTTP Request
    async post(url, data){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData
    }

    // The PUT HTTP Request
    async put(url, data){
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        return resData
    }

    // The DELETE HTTP Request
    async delete(url){
        const response = await fetch(url, {
            method: 'DELETE'
        });
        const data = await 'Deleted Successfully......';
        return data;
    }
}