const Crawler = require("crawler");
const Cheerio = require("cheerio");
const fs = require("fs");
const contentService = require("./contentService");
const path = require("path");
require("dotenv").config();
require("./overFecth");

const fontAwesome = `<script src="https://kit.fontawesome.com/1cbb170ff9.js" crossorigin="anonymous"></script>`;

const facebookScript = `
    <span class="elementor-grid-item">
        <a class="elementor-icon elementor-social-icon elementor-social-icon-facebook-f elementor-repeater-item-9758c9c" href="https://www.facebook.com/GIAIPHAPSOTOANCAU" target="_blank">
            <span class="elementor-screen-only">Facebook-f</span>
            <i class="fab fa-facebook-f"></i>
        </a>
    </span>
`;

let crawler = new Crawler({
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

                //replace the old link with VNLink and keep the dowload  link
                //Also the upload link in the CSR page
                $$("a").each((index, element) => {
                  const href = $$(element).attr("href");
                  if (
                    href &&
                    href.startsWith("https://www.avision.com") &&
                    !href.endsWith("png") &&
                    !href.includes("download") &&
                    !href.includes("uploads")
                  ) {
                    $$(element).attr(
                      "href",
                      href.replace(
                        "https://www.avision.com/en",
                        "http://localhost:3000"
                        //`http://${process.env.MOCK_DOMAIN}`
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
                //add font-awsone
                $$("head").append(fontAwesome);

                //Change title to VN
                $$("head title").text(function (index, oldText) {
                  return oldText.replace("EN", "VN");
                });

                //Change maplocation to VN
                $$('iframe[title="No. 20, Yanxin 1st Rd, Baoshan"]').attr(
                  "src",
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7397.307743665317!2d106.71016755362383!3d10.842855006115066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529ba3b90d51d%3A0x377f46b16c96b3f!2sDSG%20-%20IoT!5e0!3m2!1svi!2s!4v1701326672751!5m2!1svi!2s"
                );

                //Change item label to white
                $$("td.woocommerce-product-attributes-item__label").css(
                  "color",
                  "white;"
                );

                //Change Icon Grid and List to Fas icon
                $$("i.icon-grid")
                  .removeClass("icon-grid")
                  .addClass("fas fa-th-large");
                $$("i.icon-list")
                  .removeClass("icon-list")
                  .addClass("fas fa-list");

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

                //remove login
                $$(`a[href="http://localhost:3000/login/"]`).remove();

                //change eicons to font-awesome
                // change menu
                $$("i.eicon-menu-bar")
                  .removeClass("eicon-menu-bar")
                  .addClass("fa fa-bars");
                $$("i.eicon-close")
                  .removeClass("eicon-close")
                  .addClass("fa fa-times");

                // change left and right arrow
                $$("i.eicon-chevron-right")
                  .removeClass("eicon-chevron-right")
                  .addClass("fa fa-chevron-right");
                $$("i.eicon-chevron-left")
                  .removeClass("eicon-chevron-left")
                  .addClass("fa fa-chevron-left");

                //change icon user
                $$("i.icon-user")
                  .removeClass("icon-user")
                  .addClass("fa fa-user-o");
                //Change clock icon
                $$("i.icon-clock")
                  .removeClass("icon-clock")
                  .addClass("fa fa-clock-o");
                //Change folder icon
                $$("i.icon-folder")
                  .removeClass("icon-folder")
                  .addClass("fa fa-folder-o");
                //add facebook icon at footer
                $$("div.elementor-social-icons-wrapper.elementor-grid").append(
                  facebookScript
                );

                // Save the modified HTML to a file
                const modifiedHtml = $$.html();
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
};
