const mainDomain = process.env.MAIN_DOMAIN;

module.exports = {
  mainScript: `<div style="display: flex;  align-items: center; height: 100%; flex-flow: column ;padding-top: 20px">
    
    <h3 style="font-size: calc(20px + 3vw);padding-top: 30px">TỔNG ĐẠI LÝ KHU VỰC PHÍA BẮC</h3>
    <img style="width: 60vw; min-width: 390px; height:auto" src="/public/cdc.png">
    <h3 style="font-size: calc(20px + 3vw) ; padding-top: 120px">TỔNG ĐẠI LÝ KHU VỰC PHÍA NAM</h3>
    <img style="width: 60vw; min-width: 390px; height:auto" src="/public/vth.png">
    </div>`,
  rowNav: `<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-12782"><a href="/agency/" class="elementor-item">Hệ thống đại lý</a></li>`,
  colNav: `<li class="menu-item menu-item-type-taxonomy menu-item-object-product_cat menu-item-12782"><a href="/agency/" class="elementor-item" tabindex="0">Hệ thống đại lý</a></li>`,
  footer: `<div class="elementor-element elementor-element-5b85b7b elementor-widget elementor-widget-heading" data-id="5b85b7b" data-element_type="widget" data-widget_type="heading.default">
  <div class="elementor-widget-container">
<h2 class="elementor-heading-title elementor-size-default"><a href="/agency/">Hệ thống đại lý</a></h2>		</div>
  </div>`,
};
