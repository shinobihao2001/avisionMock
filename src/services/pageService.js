const Crawler = require("crawler");
const Cheerio = require("cheerio");
const fs = require("fs");
const contentService = require("./contentService");
const path = require("path");
require("dotenv").config();
require("./overFecth");

// const scriptToInject = `
//   <script>
//     // Override the XMLHttpRequest open method
//     const originalOpen = window.XMLHttpRequest.prototype.open;

//     window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
//       console.log('[XHR Request]', 'Method:', method, 'URL:', url);

//       // Call the original open method
//       originalOpen.apply(this, arguments);

//       // Override the onreadystatechange method to log responses
//       const originalOnReadyStateChange = this.onreadystatechange;
//       this.onreadystatechange = function () {
//         if (this.readyState === 4) {
//           //console.log('[XHR Response]', 'Status:', this.status, 'Response:', this.responseText);
//           console.log("Catch the AJAX")
//           // Send XHR details and response to the backend
//           fetch('/api/modify-xhr', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               method,
//               url,
//               status: this.status,
//               response: this.responseText,
//             }),
//           })
//           .then(response => response.json())
//           .then(data => {
//             console.log("Finish modify AJAX")
//             //console.log('[Modified XHR Response]', data.modifiedResponse);
//             setTimeout(()=>{
//               // Replace the original response with the modified response
//               this.responseText = data.modifiedResponse;

//               // Call the original onreadystatechange method
//               if (originalOnReadyStateChange) {
//                 originalOnReadyStateChange.apply(this, arguments);
//               }
//               console.log("Wait 10s done");
//             },10000) // sleep 10s

//           });
//         }
//       };
//     };
//   </script>
// `;
const fontAwesome = `<script src="https://kit.fontawesome.com/1cbb170ff9.js" crossorigin="anonymous"></script>`;
//const eicons = `<link rel="stylesheet" href="https://unpkg.com/elementor-icons/style.min.css">`;

crawler = new Crawler({
  maxConnections: 1,
});

function modifyHTML(urls, crawler) {
  return new Promise((resolve, reject) => {
    const loop = urls.map((url) => {
      return new Promise((resolve, reject) => {
        crawler.queue([
          {
            uri: url,
            callback: async (error, res, done) => {
              if (error) {
                console.log(error);
              } else {
                const newDoc = res.body;
                const $$ = Cheerio.load(newDoc);
                // const $ = res.$;
                //$("script, style").remove();

                //replace the old link with VNLink and keep the dowload link
                $$("a").each((index, element) => {
                  const href = $$(element).attr("href");
                  if (
                    href &&
                    href.startsWith("https://www.avision.com") &&
                    !href.endsWith("png") &&
                    !href.includes("download")
                  ) {
                    $$(element).attr(
                      "href",
                      href.replace(
                        "https://www.avision.com/en",
                        //"http://localhost:3000"
                        `http://${process.env.MOCK_DOMAIN}`
                      )
                      // "http://localhost:3000/"
                    );
                  }
                });

                //replace old text with translate text
                var doc = $$(process.env.SELECT_TAGS).not("style, script");
                console.log(doc.length);
                for (let index = 0; index < doc.length; index++) {
                  console.log(index);
                  let element = doc.eq(index);
                  let content = element.text().trim();

                  if (content) {
                    if (
                      element.children(":not(br):not(strong):not(span)")
                        .length == 0
                    ) {
                      let newText = await contentService.findTranslatedWord(
                        element.text().replace(/\s+/g, " ")
                      );
                      $$(element).text(newText);
                    } else {
                      const children = element.find("*").not("style, script");
                      for (
                        let childIndex = 0;
                        childIndex < children.length;
                        childIndex++
                      ) {
                        let childNode = children.eq(childIndex);
                        let node = $$(childNode);
                        if (
                          node.children(":not(br):not(strong):not(span)")
                            .length == 0 &&
                          node.text().trim()
                        ) {
                          let newText = await contentService.findTranslatedWord(
                            node.text().replace(/\s+/g, " ")
                          );
                          node.text(newText);
                        }
                      }
                    }
                  }
                }

                //remove popmade
                $$("#popmake-2659").remove();
                $$("#popmake-11307").remove();

                //remove compare button
                $$(".compare.button").remove();

                //remove compare area
                $$(".widget.yith-woocompare-widget").remove();

                //remove copmare count
                $$(".yith-woocompare-count").remove();
                $$(".yith-woocompare-counter").remove();
                $$(".result-count").remove();

                //remove entry button
                $$(".woo-entry-buttons").remove();

                //remove sreach icion
                $$(".fas.fa-search").remove();
                //remove fillter zone
                $$("aside").empty();

                //remove floating bar ontop
                $$(".owp-floating-bar").remove();

                // Replace the content with an image tag
                for (let i = 0; i < 5; i++) {
                  $$("aside").append(
                    '<img style="padding-bottom: 100px; background-repeat: repeat-y" src="https://static3.khuetu.vn/img/m/21.jpg" alt="Your Image Alt Text">'
                  );
                }
                //$$(".primary")

                //remove login
                $$(
                  `a[href="http://${process.env.MOCK_DOMAIN}/login/"]`
                ).remove();

                //ad override fecth api
                // const newScript = $$("<script>");
                // newScript.attr("src", "./overFecth.js");
                // $$("body").append(newScript);
                //$$("body").append(scriptToInject);
                //$$("body").append(scriptToInjectSendingAJAX);

                //add font-awsone
                $$("head").append(fontAwesome);

                //add eicons`
                //$$("head").append(eicons);

                // Save the modified HTML to a file
                const modifiedHtml = $$.html();

                // fs.writeFileSync(
                //   url
                //     .toString()
                //     .replace(
                //       "https://www.avision.com/en",
                //       "http://localhost:3000"
                //     )
                //     .replaceAll(":", "_")
                //     .replaceAll("/", "H"),
                //   modifiedHtml
                // );

                // Open the file in the default web browser
                // const { exec } = require("child_process");
                // exec("start modified.html");
                resolve(modifiedHtml);
              }
              done();
            },
          },
        ]);
      });
    });
    crawler.once("error", (error) => reject(error));
    crawler.once("drain", () => {
      Promise.all(loop).then((results) => {
        resolve(results);
      });
    });
  });
}

module.exports = {
  async translatePage(url) {
    let html = await modifyHTML([url], crawler);
    return html;
  },
  async saveHtmlLocal(html, filename) {
    let folder = path.join(__dirname, "localPage");
    try {
      //console.log(html);
      fs.writeFileSync(path.join(folder, filename), html[0]);
      return "Save file successfully";
    } catch (error) {
      console.log(error);
    }
  },

  getLocalName(name) {
    let localname = name
      .toString()
      .slice(27)
      .replaceAll("/", "_")
      .replaceAll("-", "_");

    return localname ? localname : "mainPage";
  },

  async getPage(name) {
    let localname = this.getLocalName(name);
    // TODO fix this later error cause by "/"
    if (localname.startsWith("_")) {
      localname = localname.slice(1);
    }
    console.log("Local name: " + localname);
    folder = path.join(__dirname, "localPage");
    try {
      let page = fs.readFileSync(path.join(folder, localname), "utf-8");
      return page;
    } catch (error) {
      console.log(error);
    }
  },

  async translateAllPage(urls) {
    for (let url of urls) {
      console.log(url);
      let html = await this.translatePage(url);
      console.log(html);
      let filename = this.getLocalName(url);
      let results = await this.saveHtmlLocal(html, filename);
    }
    return "All page translate done";
  },

  // async modifyAjaxResponse(doc) {
  //   const $$ = Cheerio.load(doc);
  //   //replace the old link with VNLink
  //   $$("a").each((index, element) => {
  //     const href = $$(element).attr("href");
  //     if (
  //       href &&
  //       href.startsWith("https://www.avision.com") &&
  //       !href.endsWith("png")
  //     ) {
  //       $$(element).attr(
  //         "href",
  //         href.replace("https://www.avision.com/en", "http://localhost:3000")
  //         // "http://localhost:3000/"
  //       );
  //     }
  //   });

  //   //replace old text with translate text
  //   var doc = $$(process.env.SELECT_TAGS).not("style, script");
  //   console.log(doc.length);
  //   for (let index = 0; index < doc.length; index++) {
  //     console.log(index);
  //     let element = doc.eq(index);
  //     let content = element.text().trim();

  //     if (content) {
  //       // console.log(content);
  //       if (element.children(":not(br)").length == 0) {
  //         let newText = await contentService.findTranslatedWord(
  //           element.text().replace(/\s+/g, " ")
  //         );
  //         //console.log(newText);
  //         $$(element).text(newText);
  //       } else {
  //         const children = element.find("*").not("style, script");
  //         for (let childIndex = 0; childIndex < children.length; childIndex++) {
  //           let childNode = children.eq(childIndex);
  //           let node = $$(childNode);
  //           if (node.children(":not(br)").length == 0 && node.text().trim()) {
  //             let newText = await contentService.findTranslatedWord(
  //               node.text().replace(/\s+/g, " ")
  //             );
  //             node.text(newText);
  //             //console.log(newText);
  //           }
  //         }
  //       }
  //     }
  //   }
  //   //remove compare button
  //   $$(".compare.button").remove();

  //   // Add a new <p> element
  //   // $$("li").empty();
  //   // $$("li").append("<p>Hello, world!</p>");
  //   //return the modifyResponse
  //   const modifiedHtml = $$.html();
  //   return modifiedHtml;
  // },
};
