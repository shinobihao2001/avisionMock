const mainDomain = process.env.MAIN_DOMAIN;

module.exports = {
  mainScript: `<div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-flow: column ;padding-top: 20px">
    
    <h3>TỔNG ĐẠI LÝ KHU VỰC PHÍA BẮC</h3>
    <img style="width: 70%; height:auto" src="https://kodak.dsg.com.vn/wp-content/uploads/2023/08/z4650078753731_bb0d3711ed0e63177f95a67c170c33c2.jpg">
    <h3 style="padding-top: 20px">TỔNG ĐẠI LÝ KHU VỰC PHÍA NAM</h3><img style="width: 70%; height:auto" src="https://kodak.dsg.com.vn/wp-content/uploads/2023/08/z4650084182571_c1481fbc31b8a22e1948edb3bed313dd.jpg">
    </div>`,
  rowNav: `<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-12782"><a href="http://${mainDomain}/agency/" class="elementor-item">Hệ thống đại lý</a></li>`,
  colNav: `<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-12782"><a href="http://${mainDomain}/agency/" class="elementor-item" tabindex="0">Hệ thống đại lý</a></li>`,
  footer: `<div class="elementor-element elementor-element-5b85b7b elementor-widget elementor-widget-heading" data-id="5b85b7b" data-element_type="widget" data-widget_type="heading.default">
  <div class="elementor-widget-container">
<h2 class="elementor-heading-title elementor-size-default"><a href="http://${mainDomain}/agency/">Hệ thống đại lý</a></h2>		</div>
  </div>`,
};
