const express = require("express");
const connectDB = require("./src/database");
const pageService = require("./src/services/pageService.js");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const bodyParser = require("body-parser");

connectDB();
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   // Override the fetch function
//   const script = `
//     <script>
//       const originalFetch = window.fetch;
//       window.fetch = function (url, options) {
//         // Log the request
//         console.log(\`[Request] URL: \${url}, Options:\`, options);

//         // Call the original fetch function
//         return originalFetch
//           .apply(this, arguments)
//           .then((response) => {
//             // Log the response
//             console.log(
//               \`[Response] URL: \${url}, Status: \${response.status}, StatusText: \${response.statusText}\`
//             );

//             // Read the response body as text
//             return response.text().then((body) => {
//               console.log(\`[Response Body] \${body}\`);
//               // Return the original response
//               return response;
//             });
//           })
//           .catch((error) => {
//             // Log any errors
//             console.error(\`[Error] URL: \${url}\`, error);
//             throw error;
//           });
//       };
//     </script>
//   `;

//   // Inject the script into the HTML
//   res.locals.htmlScript = script;
//   res.locals.write = res.write;
//   res.locals.end = res.end;

//   res.write = (chunk, encoding) => {
//     if (chunk.toString().includes("<head>")) {
//       // Inject the script into the head of the HTML
//       chunk = chunk.toString().replace("<head>", `<head>${script}`);
//     }

//     res.locals.write(chunk, encoding);
//   };

//   res.end = () => {
//     res.locals.end();
//     next();
//   };
// });

app.get("*", async (req, res) => {
  let filename = (process.env.EN_DOMAIN + req.url).toString();
  console.log(filename);
  if (filename.startsWith("_")) {
    filename = filename.slice(1);
  }
  console.log(filename);
  let html = await pageService.getPage(filename);
  //let ren = fs.readFileSync("modified.html", "utf8");
  res.setHeader("Content-Type", "text/html");
  res.send(html.toString());
});

// app.post("/api/modify-xhr", async (req, res) => {
//   let { method, url, status, response } = req.body;

//   // Perform modifications on the response as needed
//   let modifiedResponse = response;
//   if (response[0] != "<") {
//     try {
//       response = JSON.parse(response);
//       modifiedResponse = response;
//     } catch (error) {
//       console.log(error);
//     }

//     //console.log(typeof response);
//     // console.log(response);
//     for (const key in response) {
//       console.log(key);
//     }
//     //console.log(typeof response.data.productHtml);
//     //console.log(response.data);
//     // Send the modified response back to the front end
//     modifiedResponse.data.productHtml = (
//       await pageService.modifyAjaxResponse(response.data.productHtml)
//     ).toString();
//     //console.log("File chỉnh sửa : ");
//     //console.log(modifiedResponse.data.productHtml);
//   }

//   res.json({
//     method,
//     url,
//     status,
//     modifiedResponse: JSON.stringify(modifiedResponse),
//   });
// });

// app.post("/api/capture-xhr", async (req, res) => {
//   let { method, url } = req.body;

//   // Log the captured XHR details
//   console.log("[Captured XHR Request]", "Method:", method, "URL:", url);

//   // You can add additional logic here to process or store the captured details

//   res.json({
//     method,
//     url,
//     message: "XHR request captured successfully",
//   });
// });

app.listen(port, () => {
  console.log(`Server is run on http://localhost:${port}/`);
});
