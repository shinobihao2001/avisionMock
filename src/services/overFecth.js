// // Save the original fetch function
// const originalFetch = window.fetch;

// // Override the fetch function
// window.fetch = function (url, options) {
//   // Log the request
//   console.log(`[Request] URL: ${url}, Options:`, options);

//   // Call the original fetch function
//   return originalFetch
//     .apply(this, arguments)
//     .then((response) => {
//       // Log the response
//       console.log(
//         `[Response] URL: ${url}, Status: ${response.status}, StatusText: ${response.statusText}`
//       );
//       return response;
//     })
//     .catch((error) => {
//       // Log any errors
//       console.error(`[Error] URL: ${url}`, error);
//       throw error;
//     });
// };

// // Now, any fetch request made on the page will be logged
