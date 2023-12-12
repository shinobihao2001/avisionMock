const Crawler = require("crawler");
const Cheerio = require("cheerio");
const fs = require("fs");
const contentService = require("./contentService");
const linkService = require("./linkService");
const path = require("path");
const signUpWarrantyScript = require("./script/signUpWarranty");
const footerScript = require("./script/footerScript");
const emailScript = require("./script/emailScript");
const ulti = require("./ulti");
require("dotenv").config();

const fontAwesome = `<script src="https://kit.fontawesome.com/1cbb170ff9.js" crossorigin="anonymous"></script>`;

const facebookScript = `
    <span class="elementor-grid-item">
        <a class="elementor-icon elementor-social-icon elementor-social-icon-facebook-f elementor-repeater-item-9758c9c" href="https://www.facebook.com/GIAIPHAPSOTOANCAU" target="_blank">
            <span class="elementor-screen-only">Facebook-f</span>
            <i class="fab fa-facebook-f"></i>
        </a>
    </span>
`;

async function modifyHTML(page, arrayDB) {
  const $$ = Cheerio.load(page);

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
      if (element.children(":not(br):not(strong):not(span)").length == 0) {
        let newText = contentService.findTranslatedWord(
          element.text().replace(/\s+/g, " "),
          arrayDB
        );
        $$(element).text(newText);
      } else {
        const children = element.find("*").not("style, script");
        for (let childIndex = 0; childIndex < children.length; childIndex++) {
          let childNode = children.eq(childIndex);
          let node = $$(childNode);
          if (
            node.children(":not(br):not(strong):not(span)").length == 0 &&
            node.text().trim()
          ) {
            let newText = contentService.findTranslatedWord(
              node.text().replace(/\s+/g, " "),
              arrayDB
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
  $$("td.woocommerce-product-attributes-item__label").css("color", "white;");

  //Change Icon Grid and List to Fas icon
  $$("i.icon-grid").removeClass("icon-grid").addClass("fas fa-th-large");
  $$("i.icon-list").removeClass("icon-list").addClass("fas fa-list");

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

  // set with of main to 100 % before remove sidebar
  $$("#primary.content-area.clr").css("width", "100%");
  //remove fillter zone
  $$("aside").remove();

  //remove floating bar ontop
  $$(".owp-floating-bar").remove();

  //remove dateTime in footer news
  $$("time.published").remove();

  //remove login
  $$(`a[href="http://localhost:3000/login/"]`).remove();

  //change eicons to font-awesome
  // change menu
  $$("i.eicon-menu-bar").removeClass("eicon-menu-bar").addClass("fa fa-bars");
  $$("i.eicon-close").removeClass("eicon-close").addClass("fa fa-times");

  // change left and right arrow
  $$("i.eicon-chevron-right")
    .removeClass("eicon-chevron-right")
    .addClass("fa fa-chevron-right");
  $$("i.eicon-chevron-left")
    .removeClass("eicon-chevron-left")
    .addClass("fa fa-chevron-left");

  //change icon user
  $$("i.icon-user").removeClass("icon-user").addClass("fa fa-user-o");
  //Change clock icon
  $$("i.icon-clock").removeClass("icon-clock").addClass("fa fa-clock-o");
  //Change folder icon
  $$("i.icon-folder").removeClass("icon-folder").addClass("fa fa-folder-o");
  //add facebook icon at footer
  $$("div.elementor-social-icons-wrapper.elementor-grid").append(
    facebookScript
  );

  //Change continue reading in exhibiton page to Vn
  $$("div.blog-entry-readmore a").text("Đọc tiếp");

  //Change privacy statement sending email to vn
  $$(".wpforms-field-label-inline")
    .contents()
    .first()
    .replaceWith(
      "Tôi đồng ý để trang web lưu trữ thông tin mà tôi đã gửi để họ có thể phản hồi cho yêu cầu của tôi."
    );

  //Change action of check warranty
  $$("#wpforms-form-4191").attr("action", "/agent/check");

  //Change action of contac-us seding email
  $$("#wpforms-form-4192").attr("action", "/contact-us/sendEmail");
  //modify email field name
  $$("#wpforms-4192-field_5").attr("name", "subject");
  $$("#wpforms-4192-field_18").attr("name", "author");
  $$("#wpforms-4192-field_19").attr("name", "phoneNumber");
  $$("#wpforms-4192-field_1").attr("name", "email");
  $$("#wpforms-4192-field_2").attr("name", "content");
  //remove coutry and seding department
  $$("#wpforms-4192-field_14-container").remove();
  $$("#wpforms-4192-field_6-container").remove();

  //remove nav bar in partner portal
  $$("#menu-1-219c7e8").remove();
  $$("section[data-id='c49360c']").remove();

  //remove regular question at some products;
  $$("#tab-title-desc_tab").remove();

  //remove bochure title // remove bochure context
  const searchText = "Tài liệu giới thiệu";
  // Select the h2 tag based on its text content
  const h2Element = $$(`h2:contains("${searchText}")`);
  if (h2Element.length > 0) {
    // Remove the next two divs after the h2 tag's parent div
    h2Element.parent().nextAll("div").slice(0, 2).remove();
    // Remove the h2 tag
    h2Element.remove();
  }

  //Add signup warranty
  $$("section[data-id='1e178ee']").append(signUpWarrantyScript);

  //add address DSG to footer
  $$("section[data-id='53a583dc']").after(footerScript);

  //Change the warning code
  $$("script").text((i, oldText) => {
    return (
      oldText
        .replace("This field is required.", "Trường này là bắt buộc.")
        .replace(
          "Please enter a valid email address.",
          "Vui lòng nhập địa chỉ email hợp lệ."
        )
        .replace(
          "Did you mean {suggestion}?",
          "Bạn có ý kiến gì về {suggestion}?"
        )
        .replace(
          "Click to accept this suggestion.",
          "Nhấp để chấp nhận ý kiến này."
        )
        .replace(
          "{count} of {limit} max characters.",
          "{count} trên {limit} ký tự tối đa."
        )
        // Add more replacements as needed
        .replace(
          "... (add more English texts to replace) ...",
          "... (add more Vietnamese translations) ..."
        )
    );
  });

  // Save the modified HTML to a file
  const modifiedHtml = $$.html();
  return modifiedHtml;
}

function modifyReceipt(html) {
  const $ = Cheerio.load(html);
}

function modifyEmail(html) {
  const $ = Cheerio.load(html);
  $('section[data-id="16c6a99"]').after(emailScript);
  const result = $.html();
  return result;
}

module.exports = {
  async translatePage(page, arrayDB) {
    let html = await modifyHTML(page, arrayDB);
    return html;
  },
  async saveHtmlLocal(html, filename) {
    let folder = path.join(__dirname, "localPage");
    try {
      //console.log(html);
      fs.writeFileSync(path.join(folder, filename), html);
      return "Save file successfully";
    } catch (error) {
      console.log(error);
    }
  },

  async getEmailPage() {
    const name = "contact_us_email_form_";
    let folder = path.join(__dirname, "localPage");
    const page = fs.readFileSync(path.join(folder, name), "utf-8");
    const result = modifyEmail(page);
    return result;
  },

  async getPage(name) {
    let localname = ulti.getLocalName(name);
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

  async translateAllPage(links) {
    const arrayDB = await contentService.getContentArray();
    console.log(arrayDB);

    for (let link of links) {
      console.log(link);
      let page = linkService.getOriginalPage(link);
      let html = await this.translatePage(page, arrayDB);
      //console.log(html);
      let filename = ulti.getLocalName(link);
      let results = await this.saveHtmlLocal(html, filename);
    }
    return "All page translate done";
  },
};
