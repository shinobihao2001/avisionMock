function successScript(data) {
  let registrationDate = new Date(data.registrationDate);
  registrationDate = registrationDate.toLocaleDateString();

  let expirationDate = "";
  if (data.expirationDate) {
    expirationDate = new Date(data.expirationDate);
    expirationDate = expirationDate.toLocaleDateString();
  }
  return `
  <div class="elementor-element elementor-element-c12b7ee elementor-widget elementor-widget-shortcode" data-id="c12b7ee" data-element_type="widget" data-widget_type="shortcode.default">
    <div class="elementor-widget-container">
        <div class="elementor-shortcode">
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th>Số Serial</th>
                            <td>${data.serial}</td>
                        </tr>
                        <tr>
                            <th>Tên sản phẩm</th>
                            <td>${data.productName}</td>
                        </tr>
                        <tr>
                            <th>Ngày đăng ký bảo hành</th>
                            <td>${registrationDate}</td>
                        </tr>
                        <tr>
                            <th>Ngày hết hạn bảo hành</th>
                            <td>${expirationDate}</td>
                        </tr>
                        <tr>
                            <th>Ghi chú</th>
                            <td>${data.note}</td>
                        </tr>
                        <tr>
                            <th>Đã đăng ký bảo hành</th>
                            <td>${
                              data.isRegister ? "Đã đăng ký" : "Chưa đăng ký"
                            }</td>
                        </tr>
                    </tbody>
                </table>
                <div></div>
            </div>
        </div>
    </div>
</div>

  `;
}

function errorScript(mess) {
  return `<div  style="display: block; color: red; font-weight: bold; margin-top: 10px;">
    ${mess}
  </div>`;
}

module.exports = {
  successScript,
  errorScript,
};
