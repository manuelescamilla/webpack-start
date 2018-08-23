// Get data
function get (api, apiKey) {
	return new Promise((resolve, reject) => {
		fetch(`${api}`)
			.then(response => {
				if (response.status >= 200 && response.status < 300) {
					resolve(response.json())
				} else {
					const error = new Error(`HTTP Error ${response.statusText}`);
					error.status = response.statusText;
					error.response = response;
					console.log(error);
					throw error;
				}
			})
			.catch(error => {
				reject(error);
			});
	})
}

const post = (url, data) => {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers:{
			  'Content-Type': 'application/json'
			}
		  }).then(res => res.json())
		  .catch(error => console.error('Error:', error))
		  .then(response => console.log('Success:', response));
	});
}

export default {
	get: get,
	post: post
}
